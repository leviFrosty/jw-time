import { DimensionValue, View } from "react-native";
import useTheme from "../contexts/theme";

const Divider = ({
  marginVertical,
  marginHorizontal,
  borderStyle,
}: {
  marginHorizontal?: DimensionValue;
  marginVertical?: DimensionValue;
  borderStyle?: "solid" | "dotted" | "dashed" | undefined;
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: "100%",
        height: 1,
        borderColor: theme.colors.border,
        borderWidth: borderStyle ? 1 : undefined,
        borderTopWidth: !borderStyle ? 1 : undefined,
        borderStyle,
        marginVertical,
        marginHorizontal,
      }}
    />
  );
};

export default Divider;
