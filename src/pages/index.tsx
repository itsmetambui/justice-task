import type { NextPage } from "next";
import { useReducer, useState } from "react";
import useInterval from "../hooks/useInterval";
import useLongPress from "../hooks/useLongPress";

enum TubStatus {
  IDLING,
  INCREASING,
  DECRESING,
}

type TubState = {
  level: number;
  status: TubStatus;
};

const initialState: TubState = { level: 0, status: TubStatus.IDLING };

enum ActionKind {
  IncreaseWaterLevel = "INCREASE",
  DecreaseWaterLevel = "DECREASE",
  StopPlayingWithWater = "STOP",
}

type Action = {
  type: ActionKind;
};

const increaseAction: Action = {
  type: ActionKind.IncreaseWaterLevel,
};

const decreaseAction: Action = {
  type: ActionKind.DecreaseWaterLevel,
};

const stopAction: Action = {
  type: ActionKind.StopPlayingWithWater,
};

function waterReducer(state: TubState, action: Action): TubState {
  const { type } = action;

  switch (type) {
    case ActionKind.IncreaseWaterLevel:
      return state.level < 5
        ? {
            ...state,
            status: TubStatus.INCREASING,
            level: state.level + 1,
          }
        : { ...state, status: TubStatus.IDLING };

    case ActionKind.DecreaseWaterLevel:
      return state.level > 0
        ? {
            ...state,
            status: TubStatus.DECRESING,
            level: state.level - 1,
          }
        : {
            ...state,
            status: TubStatus.IDLING,
          };
    case ActionKind.StopPlayingWithWater:
      return {
        ...state,
        status: TubStatus.IDLING,
      };

    default:
      return state;
  }
}

const Bathtub: NextPage = () => {
  const [tubState, dispatch] = useReducer(waterReducer, initialState);

  useInterval(
    () =>
      tubState.status === TubStatus.INCREASING
        ? dispatch(increaseAction)
        : dispatch(decreaseAction),
    tubState.status !== TubStatus.IDLING ? 2000 : null
  );

  const defaultPressOptions = {
    shouldPreventDefault: true,
    delay: 2000,
  };

  const increaseWaterLevelEvents = useLongPress(
    {
      onLongPress: () => dispatch(increaseAction),
      onLongPressStop: () => dispatch(stopAction),
    },
    defaultPressOptions
  );

  const decreaseWaterLevelEvents = useLongPress(
    {
      onLongPress: () => dispatch(decreaseAction),
      onLongPressStop: () => dispatch(stopAction),
    },
    defaultPressOptions
  );

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          textAlign: "right",
        }}
      >
        <button {...increaseWaterLevelEvents}>increaseWaterLevel</button>
        <button {...decreaseWaterLevelEvents}>decreaseWaterLevel</button>
        <p>Water counter: {tubState.level * 20}px</p>
      </div>
      {Array.from(Array(tubState.level), (e, i) => {
        return <div key={i} style={{ backgroundColor: "blue", height: 20 }} />;
      })}
    </div>
  );
};

export default Bathtub;
