import React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {}

export function Logo(props: LogoProps): React.JSX.Element {
    return (
        <svg
            id="_レイヤー_1"
            data-name="レイヤー_1"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 500 500"
            {...props}
        >
            <defs>
                <style>
                    {`
      .st0 {
        fill: #8561c5;
      }

      .st1 {
        fill: #673ab7;
      }

      .st2 {
        fill: blue;
      }

      .st2, .st3, .st4 {
        display: none;
      }

      .st5 {
        fill: #1a1a1a;
      }

      .st4 {
        fill: #c1272d;
      }
      `}
                </style>
            </defs>
            <rect className="st5" width="500" height="500" rx="60" ry="60" />
            <rect className="st2" x="50" y="50" width="400" height="400" />
            <rect className="st4" x="60" y="60" width="380" height="380" />
            <rect
                className="st0"
                x="235.36021"
                y="32.05307"
                width="29.2794"
                height="435.89386"
                rx="14"
                ry="14"
                transform="translate(603.55324 250.00055) rotate(135.00008)"
            />
            <rect
                className="st0"
                x="91.61796"
                y="91.61811"
                width="29.2794"
                height="316.76379"
                rx="14"
                ry="14"
            />
            <rect
                className="st0"
                x="379.1022"
                y="91.61811"
                width="29.2794"
                height="316.76379"
                rx="14"
                ry="14"
            />
            <rect
                className="st1"
                x="235.36033"
                y="32.05307"
                width="29.2794"
                height="435.89386"
                rx="14"
                ry="14"
                transform="translate(250.00044 -103.55342) rotate(45.00007)"
            />
            <g className="st3">
                <rect
                    className="st1"
                    x="0"
                    y="420"
                    width="80"
                    height="80"
                    rx="39.99996"
                    ry="39.99996"
                />
                <rect
                    className="st1"
                    x="420.00003"
                    y="0"
                    width="80"
                    height="80"
                    rx="39.99996"
                    ry="39.99996"
                    transform="translate(920.00007 80) rotate(180)"
                />
                <rect
                    className="st1"
                    x="240.00001"
                    y="-68.18648"
                    width="19.99999"
                    height="216.37297"
                    rx="9.99997"
                    ry="9.99997"
                    transform="translate(290.00011 -209.99998) rotate(90.00003)"
                />
                <rect
                    className="st1"
                    x="240.00001"
                    y="351.81352"
                    width="19.99999"
                    height="216.37297"
                    rx="9.99997"
                    ry="9.99997"
                    transform="translate(710.00012 210.00023) rotate(90.00003)"
                />
            </g>
        </svg>
    );
}
