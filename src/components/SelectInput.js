import React, { useState } from "react";
import Select from "react-select";

function SelectInput({ options, onSelectChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (onSelectChange) {
      onSelectChange(selectedOption);
    }
  };

  return (
    <div>
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
      />
    </div>
  );
}

export default SelectInput;
