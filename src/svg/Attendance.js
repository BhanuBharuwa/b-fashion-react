import React from 'react'
import Svg, { Path, G, Circle } from 'react-native-svg'

const Attendance = () => {
    return (
        <Svg height="120" viewBox="0 0 512 512" width="120"
            xmlns="http://www.w3.org/2000/svg">
            <G id="Flat">
                <Path d="m72 448h368v40h-368z" fill="#78909c" />
                <Path d="m144 24h224v136h-224z" fill="#e0e0e0" />
                <Path d="m456 456h-400v-233l16-71h368l16 71z" fill="#90a4ae" />
                <Circle cx="256" cy="304" fill="#42a5f5" r="120" />
                <Path d="m204.054 343.9-8.108-13.8 52.054-30.6v-75.5h16v80.081a8 8 0 0 1 -3.946 6.9z" fill="#36474f" />
                <G fill="#1a76d2">
                    <Path d="m136 296h24v16h-24z" />
                    <Path d="m352 296h24v16h-24z" />
                    <Path d="m150.469 350h24v16h-24z" transform="matrix(.866 -.5 .5 .866 -157.233 129.197)" />
                    <Path d="m337.531 242h24v16h-24z" transform="matrix(.866 -.5 .5 .866 -78.172 208.259)" />
                    <Path d="m190 389.531h24v16h-24z" transform="matrix(.5 -.866 .866 .5 -243.272 373.703)" />
                    <Path d="m298 202.469h24v16h-24z" transform="matrix(.5 -.866 .866 .5 -27.272 373.703)" />
                    <Path d="m248 400h16v24h-16z" />
                    <Path d="m248 184h16v24h-16z" />
                    <Path d="m302 385.531h16v24h-16z" transform="matrix(.866 -.5 .5 .866 -157.235 208.263)" />
                    <Path d="m194 198.469h16v24h-16z" transform="matrix(.866 -.5 .5 .866 -78.172 129.2)" />
                    <Path d="m341.531 346h16v24h-16z" transform="matrix(.5 -.866 .866 .5 -135.273 481.698)" />
                    <Path d="m154.469 238h16v24h-16z" transform="matrix(.5 -.866 .866 .5 -135.272 265.7)" />
                </G>
                <Path d="m256 432a128 128 0 1 1 128-128 128.144 128.144 0 0 1 -128 128zm0-240a112 112 0 1 0 112 112 112.127 112.127 0 0 0 -112-112z" fill="#1665c0" />
                <Circle cx="112" cy="200" fill="#ffe082" r="16" />
                <Path d="m184 80h32v16h-32z" fill="#36474f" />
                <Path d="m184 112h32v16h-32z" fill="#36474f" />
                <Path d="m240 80h88v16h-88z" fill="#36474f" />
                <Path d="m184 48h32v16h-32z" fill="#36474f" />
                <Path d="m240 48h88v16h-88z" fill="#36474f" />
                <Path d="m240 112h88v16h-88z" fill="#36474f" />
            </G>
        </Svg>
    )
}

export default Attendance