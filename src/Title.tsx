import React from "react";
import { Text } from "@visx/text";

function RenderTitle(props: any) {
  const { id, config } = props;
  const { angle, x, y, dx, dy, font, width, fill, value, verticalAnchor } =
    config;

  return (
    <Text
      angle={angle}
      x={x}
      y={y}
      dx={dx}
      dy={dy}
      width={width}
      fill={fill}
      fontFamily={font.family}
      fontSize={font.size}
      verticalAnchor={verticalAnchor}
      style={{
        fontWeight: font.weight,
      }}
    >
      {value}
    </Text>
  );
}

export default RenderTitle;
