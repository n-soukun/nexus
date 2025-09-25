import { Box, BoxProps } from "@mui/material";

export interface LogoViewProps extends BoxProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    padding?: number | string;
    backgroundColor?: string;
}

export function LogoView({
    src,
    alt,
    width = 68,
    height = 68,
    padding = 1,
    backgroundColor = "#1a1a1a",
    ...props
}: LogoViewProps): React.JSX.Element {
    return (
        <Box
            border={1}
            borderColor="divider"
            borderRadius={1}
            lineHeight={0}
            sx={{
                width,
                height,
                padding,
                backgroundColor,
            }}
            {...props}
        >
            <img
                src={src}
                alt={alt ?? "Logo"}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
            />
        </Box>
    );
}
