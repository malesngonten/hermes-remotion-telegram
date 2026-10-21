import { Composition, registerRoot } from "remotion";
import { MotionScene } from "./MotionScene";
import { HelloWorld } from "./HelloWorld";

/**
 * Entry point. `registerRoot` is mandatory in Remotion v4.
 * Add / remove <Composition> entries to register new scenes.
 */
const RemotionRoot = () => (
  <>
    <Composition
      id="MotionScene"
      component={MotionScene}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="HelloWorld"
      component={HelloWorld}
      durationInFrames={60}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(RemotionRoot);
