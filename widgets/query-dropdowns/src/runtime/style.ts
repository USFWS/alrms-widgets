import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'

export function getStyle(theme: IMThemeVariables): SerializedStyles {
  return css`
    height: 100%;
    overflow: auto;
    padding: ${theme.sys.spacing(4)} ${theme.sys.spacing(4)} 15% ${theme.sys.spacing(4)};
    background-color: ${theme.sys.color.surface.paper};

    h3 {
      color: ${theme.sys.color.surface.paperText};
      font-size: ${theme.typography?.sizes?.display3 || '1.25rem'};
      font-weight: ${theme.typography?.weights?.bold || 'bold'};
      margin-bottom: ${theme.sys.spacing(2)};
    }

    h4 {
      color: ${theme.sys.color.surface.paperText};
      font-size: ${theme.typography?.sizes?.body1 || '0.875rem'};
      font-weight: ${theme.typography?.weights?.medium || '500'};
      margin-bottom: ${theme.sys.spacing(2)};
    }

    .dropdown {
      min-width: 100px;
      max-width: 200px;
      width: 90%;
      padding-bottom: 0;
    }
  `
}

export function getYearSliderStyle(theme: IMThemeVariables): SerializedStyles {
  const thumbSize = 16

  return css`
    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin: ${theme.sys.spacing(2)} calc(${thumbSize}px / 1);
      height: calc(${thumbSize}px + 1.6rem);
      max-width: 200px;
      min-width: 32px;
    }

    .input-wrapper {
      width: calc(100% + ${thumbSize}px);
      position: absolute;
      height: ${thumbSize}px;
    }

    .control-wrapper {
      width: 90%;
      position: absolute;
      height: ${thumbSize}px;
    }

    .input {
      position: absolute;
      width: 90%;
      pointer-events: none;
      appearance: none;
      height: 100%;
      opacity: 0;
      z-index: 3;
      padding: 0;

      &::-webkit-slider-thumb {
        appearance: none;
        pointer-events: all;
        width: ${thumbSize}px;
        height: ${thumbSize}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-moz-range-thumb {
        appearance: none;
        pointer-events: all;
        width: ${thumbSize}px;
        height: ${thumbSize}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-ms-thumb {
        appearance: none;
        pointer-events: all;
        width: ${thumbSize}px;
        height: ${thumbSize}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-webkit-slider-runnable-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &::-moz-range-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &::-ms-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &:focus::-webkit-slider-runnable-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }
    }

    .control-label {
      position: absolute;
      top: 100%;
      transform: translateX(-50%);
      white-space: nowrap;
      color: ${theme.sys.color.surface.paperText};
      font-size: ${theme.typography?.sizes?.body2 || '0.75rem'};
    }

    .rail {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      height: 6px;
      border-radius: 3px;
      background: ${theme.sys.color.divider.secondary};
    }

    .inner-rail {
      position: absolute;
      height: 100%;
      background: ${theme.sys.color.primary.main};
      opacity: 0.6;
    }

    .control {
      width: ${thumbSize}px;
      height: ${thumbSize}px;
      border-radius: 50%;
      position: absolute;
      background: ${theme.sys.color.surface.paper};
      border: 2px solid ${theme.sys.color.primary.main};
      top: 50%;
      margin-left: calc(${thumbSize}px / -2);
      transform: translate3d(0, -50%, 0);
      z-index: 2;
      box-shadow: ${theme.sys.shadow[1]};

      &:hover {
        box-shadow: ${theme.sys.shadow[2]};
      }
    }
  `
}

export function getZoneSelectionStyle(theme: IMThemeVariables): SerializedStyles {
  return css`
    .group-buttons {
      display: flex;
      gap: ${theme.sys.spacing(2)};
      padding-bottom: ${theme.sys.spacing(2)};
    }

    .btn {
      flex: 1;
    }

    .dropdown {
      padding-bottom: ${theme.sys.spacing(4)};
    }
  `
}

export function getDrawToolStyle(theme: IMThemeVariables): SerializedStyles {
  return css`
    .drawTool {
      display: flex;
      gap: ${theme.sys.spacing(2)};
    }
  `
}
