// Builds the key previews used in the documentation (npm run doc-images).
// The action images are white on a transparent background, which is invisible on GitHub's light theme,
// so each preview places the unmodified PNG on a dark key background. The action images are only read.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ACTIONS_DIR = "com.mcristoni.windows-shortcuts.sdPlugin/imgs/actions";
const OUT_DIR = "docs/images";
const SIZE = 144;

const PREVIEWS = [
	{ source: "dnd/dnd-off@2x.png", output: "dnd-off.png" },
	{ source: "dnd/dnd-on@2x.png", output: "dnd-on.png" }
];

mkdirSync(OUT_DIR, { recursive: true });

for (const { source, output } of PREVIEWS) {
	const image = readFileSync(`${ACTIONS_DIR}/${source}`).toString("base64");
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${SIZE} ${SIZE}">
		<rect width="${SIZE}" height="${SIZE}" rx="20" fill="#1c1c1f"/>
		<image width="${SIZE}" height="${SIZE}" xlink:href="data:image/png;base64,${image}"/>
	</svg>`;
	writeFileSync(`${OUT_DIR}/${output}`, new Resvg(svg, { fitTo: { mode: "width", value: SIZE * 2 } }).render().asPng());
	console.log(`${OUT_DIR}/${output}`);
}
