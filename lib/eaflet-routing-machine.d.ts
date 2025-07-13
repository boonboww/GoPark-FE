// types/leaflet-routing-machine.d.ts
import "leaflet";
import "leaflet-routing-machine";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions extends L.ControlOptions {
      waypoints?: L.LatLng[];
      lineOptions?: {
        styles?: L.PathOptions[];
      };
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
      show?: boolean;
      createMarker?: () => null;
    }

    interface Instruction {
      type: string;
      distance: number;
      time: number;
      road: string;
      direction: string;
      exit?: number;
      index: number;
      mode: string;
      text: string;
    }

    interface RouteSummary {
      totalDistance: number;
      totalTime: number;
    }

    interface Waypoint {
      latLng: L.LatLng;
      name: string;
      options?: Record<string, unknown>;
    }

    interface Route {
      name: string;
      coordinates: L.LatLng[];
      instructions: Instruction[];
      summary: RouteSummary;
      inputWaypoints: L.LatLng[];
      actualWaypoints: L.LatLng[];
      waypoints: Waypoint[];
      bounds: L.LatLngBounds;
    }

    interface RoutesFoundEvent {
      routes: Route[];
      waypoints: L.LatLng[];
    }

    class Control extends L.Control {
      constructor(options?: RoutingControlOptions);

      on(type: "routesfound", fn: (e: RoutesFoundEvent) => void): this;
      on(type: "routingerror", fn: (err: ErrorEvent) => void): this;

      addTo(map: L.Map): this;
      remove(): void;
    }

    function control(options?: RoutingControlOptions): Control;
  }
}
