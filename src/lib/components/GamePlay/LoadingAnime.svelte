<script lang="ts">
	import { dark } from '$lib/stores/theme';
</script>
<div class="flex flex-col container m-auto">
	<div class="logoBox">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.01 80.76" class="logobox right">
			<path d="M59.21,23.69A22.89,22.89,0,0,0,40.69,3.37,189.29,189.29,0,0,0,5.06,0C3.36,0,1.68,0,0,.07,0,.26,0,.45,0,.65V29.4L25.22,44a10.07,10.07,0,0,1,5,8.72V80.76q5.28-.7,10.45-1.69A22.9,22.9,0,0,0,59.21,58.74q.8-8.66.8-17.52T59.21,23.69Z"/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65.03 80.16" class="logobox left">
			<path d="M60,68.48A10.08,10.08,0,0,0,49.92,51L29.77,62.67V0Q24.51.71,19.32,1.7A22.86,22.86,0,0,0,.81,22Q0,30.67,0,39.54T.81,57.07A22.86,22.86,0,0,0,19.32,77.39a188.53,188.53,0,0,0,20.46,2.77Z"/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.26 50.26" class="logobox circle">
			<circle cx="25.13" cy="25.13" r="25.13"/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.26 50.26" class="logobox circle_ani">
			<circle cx="25.13" cy="25.13" r="25.13"/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.38 91.26" class="logobox fingger" class:dark={$dark}>
			<path d="M10,91.26,30.23,79.59A10.08,10.08,0,0,0,20.15,62.14L0,73.77V10.08A10.08,10.08,0,0,1,10.08,0h0A10.07,10.07,0,0,1,20.15,10.08V38.82l25.2,14.59a10.07,10.07,0,0,1,5,8.72V90.19Z"/>
		</svg>
	</div>
	<div class="textBox">
		<span class="connect">L</span>
		<span class="connect">o</span>
		<span class="connect">a</span>
		<span class="connect">d</span>
		<span class="connect">i</span>
		<span class="connect">n</span>
		<span class="connect">g</span>
		<span class="connect">.</span>
		<span class="connect">.</span>
		<span class="connect">.</span>
	</div>
</div>

<style lang="scss">
    .container {
        position: relative;
        width: 130px;
        height: 131px;
        align-items: center;
        transform: scale(1);
    }
    .logoBox {
        position: relative;
        width: 115px;
        height: 111px;
    }
    .textBox {
        position: relative;
        height: 20px;
    }
    .right {
        position: absolute;
        width: 63px;
        height: 85px;
        top: 26px;
        left: 51.5px;
        fill: #a233b7;
    }
    .left {
        position: absolute;
        width: 68px;
        height: 84px;
        top: 27.17px;
        left: 0px;
        fill: #25b7c6;
    }
    .circle {
        position: absolute;
        width: 60px;
        height: 60px;
        top: -6px;
        left: 11px;
        fill: #ffd41a;
    }
    .fingger {
        position: absolute;
        width: 53px;
        height: 95px;
        top: 16.5px;
        left: 30.5px;
        fill: #F0F2F5;
	    &.dark {
            fill: #202020;
        }
    }
    .circle_ani {
        position: absolute;
        width: 60px;
        height: 60px;
        top: -6px;
        left: 11px;
        animation: scale 1s infinite ease-out;
        fill: #ffd41a;
    }
    @keyframes scale {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
    .textBox span {
        position: relative;
        display: inline-block;
        width: auto;
        margin: 0px;
        padding: 0px;
        text-decoration: none;
        letter-spacing: -3px;
        font-size: 16px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        border: 0px solid black;
        animation: positionY 1s infinite ease-in-out;
    }
    @keyframes positionY {
        0% {
            transform: translateY(0px);
            opacity: 100%;
        }
        25% {
            transform: translateY(-3px);
            opacity: 100%;
        }
        50% {
            transform: translateY(0px);
            transform: scale(1);
        }
        100% {
            transform: translateY(0px);
            transform: scale(1);
        }
    }
    .connect:nth-child(0) {
        animation-delay: .1s;
    }
    .connect:nth-child(1) {
        animation-delay: .2s;
    }
    .connect:nth-child(2) {
        animation-delay: .3s;
    }
    .connect:nth-child(3) {
        animation-delay: .4s;
    }
    .connect:nth-child(4) {
        animation-delay: .5s;
    }
    .connect:nth-child(5) {
        animation-delay: .6s;
    }
    .connect:nth-child(6) {
        animation-delay: .7s;
    }
    .connect:nth-child(7) {
        animation-delay: .8s;
    }
    .connect:nth-child(8) {
        animation-delay: .9s;
    }
    .connect:nth-child(9) {
        animation-delay: 1s;
    }
    .connect:nth-child(10) {
        animation-delay: 1.1s;
    }
    .connect:nth-child(11) {
        animation-delay: 1.2s;
    }
    .connect:nth-child(12) {
        animation-delay: 1.3s;
    }
    .connect:nth-child(13) {
        animation-delay: 1.3s;
    }
</style>