import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '@/theme';
import { withAlpha } from '@/utils';
import { ENV } from '@/lib/env';

type LatLng = [number, number];

// Fixed dispatch origin (GOODR warehouse — Denver, CO, matching the seed data).
const ORIGIN: LatLng = [39.7699, -104.982];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Build a believable curved route from the warehouse to a per-order destination. */
function buildRoute(seed: string): LatLng[] {
  const h = hash(seed || 'goodr');
  const dLat = 0.028 + ((h % 1000) / 1000) * 0.05; // head south
  const dLng = 0.03 + (((h >> 3) % 1000) / 1000) * 0.06; // …and east (toward Aurora)
  const dest: LatLng = [ORIGIN[0] - dLat, ORIGIN[1] + dLng];

  const N = 8;
  const amp = 0.012 + ((h % 7) / 7) * 0.01;
  const dirLat = dest[0] - ORIGIN[0];
  const dirLng = dest[1] - ORIGIN[1];
  const len = Math.hypot(dirLat, dirLng) || 1;
  // Perpendicular unit vector for gentle S-curve.
  const pLat = -dirLng / len;
  const pLng = dirLat / len;

  const pts: LatLng[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const wobble = Math.sin(t * Math.PI) * amp * (h % 2 ? 1 : -1);
    pts.push([
      lerp(ORIGIN[0], dest[0], t) + pLat * wobble,
      lerp(ORIGIN[1], dest[1], t) + pLng * wobble,
    ]);
  }
  return pts;
}

function pointAlong(route: LatLng[], progress: number): { point: LatLng; index: number } {
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const l = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]);
    segs.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i] || i === segs.length - 1) {
      const t = segs[i] === 0 ? 0 : Math.min(target / segs[i], 1);
      return {
        point: [lerp(route[i][0], route[i + 1][0], t), lerp(route[i][1], route[i + 1][1], t)],
        index: i,
      };
    }
    target -= segs[i];
  }
  return { point: route[route.length - 1], index: route.length - 2 };
}

function buildHtml(opts: {
  apiKey: string;
  route: LatLng[];
  driver: LatLng;
  traveled: LatLng[];
  showDriver: boolean;
  statusColor: string;
  bearing: number;
}) {
  const { apiKey, route, driver, traveled, showDriver, statusColor, bearing } = opts;
  const pathFull = route.map(([lat, lng]) => ({ lat, lng }));
  const pathTraveled = traveled.map(([lat, lng]) => ({ lat, lng }));
  const driverPos = { lat: driver[0], lng: driver[1] };

  const darkStyles = [
    { elementType: 'geometry', stylers: [{ color: '#0a0f1c' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1c' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#141c2e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060912' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  ];

  const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<style>
  html,body,#map{height:100%;width:100%;margin:0;background:#0A0F1C}
  .drv{background:#2E90FA;border:2px solid #fff;border-radius:50%;width:32px;height:32px;
       display:flex;align-items:center;justify-content:center;
       box-shadow:0 0 0 8px rgba(46,144,250,.24),0 4px 10px rgba(0,0,0,.6)}
  .pin{width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
       border:2px solid rgba(255,255,255,.9);box-shadow:0 2px 8px rgba(0,0,0,.6)}
  .dot{width:16px;height:16px;border-radius:50%;border:3px solid #0A0F1C;background:#93A4C1;box-shadow:0 0 0 2px #93A4C1}
  .gm-style-cc, .gmnoprint, a[href^="https://maps.google.com/maps"] { display: none !important; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  function initMap() {
    var route = __ROUTE__;
    var traveled = __TRAVELED__;
    var driver = __DRIVER__;
    var showDriver = __SHOW_DRIVER__;
    var statusColor = __STATUS_COLOR__;
    var bearing = __BEARING__;

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: driver,
      styles: __DARK_STYLES__,
      disableDefaultUI: true,
      gestureHandling: 'greedy'
    });

    var fullPath = new google.maps.Polyline({
      path: route,
      geodesic: true,
      strokeColor: '#2E90FA',
      strokeOpacity: 0.38,
      strokeWeight: 5,
      map: map
    });

    if (showDriver && traveled.length > 0) {
      new google.maps.Polyline({
        path: traveled,
        geodesic: true,
        strokeColor: '#22D3EE',
        strokeOpacity: 0.95,
        strokeWeight: 6,
        map: map
      });
    }

    function CustomHTMLOverlay(position, html, anchor) {
      this.position = position;
      this.html = html;
      this.anchor = anchor || [16, 16];
      this.setMap(map);
    }
    CustomHTMLOverlay.prototype = new google.maps.OverlayView();
    CustomHTMLOverlay.prototype.onAdd = function() {
      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.cursor = 'pointer';
      div.innerHTML = this.html;
      this.div = div;
      var panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };
    CustomHTMLOverlay.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      if (!overlayProjection || !this.div) return;
      var point = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.position.lat, this.position.lng));
      if (point) {
        this.div.style.left = (point.x - this.anchor[0]) + 'px';
        this.div.style.top = (point.y - this.anchor[1]) + 'px';
      }
    };
    CustomHTMLOverlay.prototype.onRemove = function() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    };

    new CustomHTMLOverlay(route[0], '<div class="dot"></div>', [8, 8]);
    new CustomHTMLOverlay(route[route.length - 1], '<div class="pin" style="background:' + statusColor + '"></div>', [12, 22]);

    if (showDriver) {
      var arrowHtml = '<div class="drv"><div style="transform:rotate(' + bearing + 'deg);display:flex"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2 L19.5 21 L12 16.3 L4.5 21 Z" fill="#fff"/></svg></div></div>';
      new CustomHTMLOverlay(driver, arrowHtml, [16, 16]);
    }

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < route.length; i++) {
      bounds.extend(route[i]);
    }
    map.fitBounds(bounds, { top: 38, bottom: 44, left: 38, right: 38 });
  }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=__API_KEY__&callback=initMap" async defer></script>
</body>
</html>`;

  return template
    .replace('__ROUTE__', JSON.stringify(pathFull))
    .replace('__TRAVELED__', JSON.stringify(pathTraveled))
    .replace('__DRIVER__', JSON.stringify(driverPos))
    .replace('__SHOW_DRIVER__', String(showDriver))
    .replace('__STATUS_COLOR__', JSON.stringify(statusColor))
    .replace('__BEARING__', Number.isFinite(bearing) ? bearing.toFixed(1) : '0')
    .replace('__DARK_STYLES__', JSON.stringify(darkStyles))
    .replace('__API_KEY__', apiKey);
}

export interface DeliveryMapProps {
  /** 0 = at pickup, 1 = delivered. */
  progress: number;
  destinationLabel: string;
  etaLabel?: string | null;
  distanceMi?: number;
  statusLabel: string;
  statusColor: string;
  height?: number;
  /** Show the moving driver marker (hide before a driver is assigned). */
  showDriver?: boolean;
  /** Varies the destination location per order/delivery. */
  seed?: string;
}

export function DeliveryMap({
  progress,
  destinationLabel,
  etaLabel,
  distanceMi,
  statusLabel,
  statusColor,
  height = 230,
  showDriver = true,
  seed,
}: DeliveryMapProps) {
  const inTransit = showDriver && progress > 0.02 && progress < 0.99;

  const html = useMemo(() => {
    const route = buildRoute(seed ?? destinationLabel);
    const { point: driver, index } = pointAlong(route, progress);
    const traveled = [...route.slice(0, index + 1), driver];
    const a = route[index];
    const b = route[Math.min(index + 1, route.length - 1)];
    // 0° = pointing north (up); rotate clockwise toward travel heading.
    const bearing = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    return buildHtml({ apiKey: ENV.googleMapsApiKey, route, driver, traveled, showDriver, statusColor, bearing });
  }, [seed, destinationLabel, progress, showDriver, statusColor]);

  return (
    <View
      style={{
        height,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.hair,
        backgroundColor: '#0A0F1C',
      }}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#0A0F1C' }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="hardware"
      />

      {/* Overlays — labels only, never block map gestures */}
      <View
        pointerEvents="none"
        className="absolute top-4 left-4 right-4 flex-row items-center justify-between"
      >
        <View
          className="flex-row items-center rounded-pill px-2.5 py-1"
          style={{ backgroundColor: withAlpha(colors.black, 0.6) }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
          <Text className="text-white text-[11px] font-bold">{statusLabel}</Text>
        </View>
        {inTransit ? (
          <View
            className="flex-row items-center rounded-pill px-2.5 py-1"
            style={{ backgroundColor: withAlpha(colors.brandBlue, 0.92) }}
          >
            <MaterialCommunityIcons name="record-circle" size={11} color={colors.white} />
            <Text className="text-white text-[10px] font-bold ml-1">LIVE</Text>
          </View>
        ) : null}
      </View>

      <View
        pointerEvents="none"
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-3.5 py-2.5"
        style={{ backgroundColor: withAlpha(colors.black, 0.55) }}
      >
        <View className="flex-row items-center flex-1 pr-2">
          <MaterialCommunityIcons name="map-marker" size={14} color={statusColor} />
          <Text className="text-white text-[12px] font-semibold ml-1.5" numberOfLines={1}>
            {destinationLabel}
          </Text>
        </View>
        <View className="flex-row items-center">
          {distanceMi != null ? (
            <Text className="text-ink-1 text-[12px] font-semibold mr-3">{distanceMi} mi</Text>
          ) : null}
          {etaLabel ? (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-fast" size={14} color={colors.brandCyan} />
              <Text className="text-white text-[12px] font-bold ml-1" numberOfLines={1}>
                {etaLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
