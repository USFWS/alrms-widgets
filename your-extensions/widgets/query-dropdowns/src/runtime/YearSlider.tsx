import React from "react";
import "./style.scss";

export default function YearSlider({ min, max, value, step, onChange, theme }) {
  //const theme = props.theme;
  const [minValue, setMinValue] = React.useState(value ? value.min : min);
  const [maxValue, setMaxValue] = React.useState(value ? value.max : max);

  React.useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange = (e) => {
    e.preventDefault();
    const newMinVal = Math.min(+e.target.value, maxValue - step);
    if (!value) setMinValue(newMinVal);
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const newMaxVal = Math.max(+e.target.value, minValue + step);
    if (!value) setMaxValue(newMaxVal);
    onChange({ min: minValue, max: newMaxVal });
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  const setCSSVariables = (theme) => {
    const colors = theme.colors;
    const variables = {};

    for (const [key, value] of Object.entries(colors)) {
      variables[`--${key}`] = value;
    }

    return variables;
  };

  const style = setCSSVariables(theme);

  return (
    <div className="wrapper">
      <div className="input-wrapper">
        <input
          className="input"
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          className="input"
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />
      </div>

      <div className="control-wrapper" style={style}>
        <div className="control" style={{ left: `${minPos}%` }} />
        <div className="control-label" style={{ left: `${minPos}%` }}>
          {minValue}
        </div>
        <div className="rail">
          <div
            className="inner-rail"
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
          />
        </div>
        <div className="control" style={{ left: `${maxPos}%` }} />
        <div className="control-label" style={{ left: `${maxPos}%` }}>
          {maxValue}
        </div>
      </div>
    </div>
  );
}
