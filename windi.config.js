import { defineConfig } from 'vite-plugin-windicss';
import defaultConfig from 'windicss/defaultConfig';
import colors from 'windicss/colors';
import typography from 'windicss/plugin/typography';
import aspectRatio from 'windicss/plugin/aspect-ratio';
import lineClamp from 'windicss/plugin/line-clamp';
import forms from 'windicss/plugin/forms';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import isObject from 'lodash/isObject';
// @ts-ignore
import colorset from './src/lib/styles/colors';
// @ts-ignore
import { screens, verticals } from './src/lib/styles/screens';

// build時の警告への対処: warn - Please update your color palette to eliminate this warning.
// 下位互換のために残された廃止済の色名を削除する。将来のバージョンで完全に削除され、警告が解消される可能性あり。
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];
delete colors['zink'];

const colorNames = flatten(map(colorset, (v, k) => isObject(v) ? map(keys(v), s => `${k}-${s}`) : k));
const borderRadius = {
  'none' : '0px',
  'sm'   : '0.125rem',
  DEFAULT: '0.25rem',
  'md'   : '0.375rem',
  'lg'   : '0.5rem',
  'xl'   : '0.75rem',
  '2xl'  : '1rem',
  '2.5xl': '1.25rem',
  '3xl'  : '1.5rem',
  '4xl'  : '1.75rem',
  '5xl'  : '2rem',
  'full' : '9999px',
};

const rawVariants = Object.entries(verticals).map(([n, v], i, a) => {
  const label = `v${n}`;
  let raw;
  if(i === 0) {
    raw = `(max-height: ${v}px)`;
  } else if(i + 1 < a.length) {
    raw = `(min-height: ${v}px) and (max-height: ${a[i + 1][1] - 1}px)`;
  } else {
    raw = `(min-height: ${v}px)`;
  }
  return [label, { raw }];
});

export default defineConfig({
  safelist: [
    colorNames.map(n => `bg-${n}`),
    colorNames.map(n => `border-${n}`),
    colorNames.map(n => `text-${n}`),
    Object.keys(borderRadius).map(n => `rounded-${n}`),
  ],
  extract: {
    include: ['src/**/*.{svelte,html,css}'],
    exclude: ['node_modules', '.git']
  },
  darkMode: 'class',
  theme: {
    screens: {
      ...Object.fromEntries(rawVariants),
      ...mapValues(screens, v => v + 'px')
    },
    fontFamily: {
      'sans': ['Arial', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif']
    },
    fontSize: {
      'xxs': '.625rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
    },
    boxShadow: {
      ...defaultConfig.theme.boxShadow,
      '01dp': '0px  1px  1px #1A202E24, 0px 2px  1px #1A202E1F, 0px  1px  3px #1A202E33',
      '02dp': '0px  1px  1px #1A202E24, 0px 2px  1px #1A202E1F, 0px  1px  3px #1A202E33',
      '03dp': '0px  3px  4px #00000024, 0px 3px  3px #0000001F, 0px  1px  8px #00000033',
      '04dp': '0px  4px  5px #00000024, 0px 1px 10px #0000001F, 0px  2px  4px #00000033',
      '06dp': '0px  6px 10px #00000024, 0px 1px 18px #0000001F, 0px  3px  5px #00000033',
      '08dp': '0px  8px 10px #00000024, 0px 3px 14px #0000001F, 0px  5px  5px #00000033',
      '09dp': '0px  8px 10px #00000024, 0px 3px 14px #0000001F, 0px  5px  5px #00000033',
      '12dp': '0px 12px 17px #00000024, 0px 5px 22px #0000001F, 0px  7px  8px #00000033',
      '16dp': '0px 16px 24px #00000024, 0px 6px 30px #0000001F, 0px  8px 10px #00000033',
      '24dp': '0px 24px 38px #00000024, 0px 9px 46px #0000001F, 0px 11px 15px #00000033',
    },
    borderRadius,
    extend: {
      colors: {
        ...colors,
        ...colorset,
      },
      width: {
        'xs': '280px',
        'sm': '530px',
        'md': '730px'
      },
      maxWidth: {
        'sm': '280px',
      }
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
    lineClamp,
  ]
});