import { Canvas, Object as FabricObject } from "fabric";

export interface ExtendedCanvas extends Canvas {
  onDeleteObject?: (target: FabricObject) => void;
}
