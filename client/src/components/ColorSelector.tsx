import React, { useState, useEffect } from 'react';
import { ColorAPI } from '@/api';
import type { Color } from '@/types/api/color.types';

interface ColorSelectorProps {
  onColorChange: (color: Color) => void;
  defaultColor?: string;
  initialColor?: Color;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  onColorChange,
  initialColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(
    initialColor
  );
  const [colors, setColors] = useState<Color[]>();

  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
    }
  }, [initialColor]);

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  useEffect(() => {
    ColorAPI.getAll().then((data) => {
      setColors(data.data);
      console.log(data.data);
    });
  }, []);

  return (
    <div className="color-selecter">
      <div className="mb-4 flex flex-wrap gap-2">
        {colors?.map((color) => (
          <button
            key={color._id}
            type="button"
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              selectedColor?.hex === color.hex
                ? 'scale-110 border-gray-800'
                : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorChange(color)}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
