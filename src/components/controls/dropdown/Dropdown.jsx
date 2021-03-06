import ClassNames from "classnames";
import PropTypes from "prop-types";
import React, {useRef, useState} from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import "./Dropdown.scss";

function Dropdown({options, onItemClick, selectable, buttonClassName, buttonText, ButtonIcon, defaultSelectedItem: defaultSelectedItemValue}) {
    const dropdownRef = useRef();
    useOnClickOutside(dropdownRef, () => setIsListOpen(false));

    const [isListOpen, setIsListOpen] = useState(false);

    function handleToggleList() {
        setIsListOpen((isListOpen) => !isListOpen);
    }

    const [selectedItemValue, setSelectedItemValue] = useState(defaultSelectedItemValue);

    function handleItemClick(e) {
        setSelectedItemValue(e.target.dataset.value);
        onItemClick(e.target.dataset.value);

        setIsListOpen(false);
    }


    return <div className="Dropdown">
        <button onClick={handleToggleList} className={buttonClassName}>
            {ButtonIcon}{buttonText}
        </button>
        {isListOpen &&
        <div ref={dropdownRef} className="Dropdown__Menu">

            <ul className="Dropdown__List">
                {options.map((option) => {
                    const dropdownItemClasses = ClassNames("Dropdown__Item", {"Dropdown__Item--selected": option.value === selectedItemValue && selectable});

                    return <li data-value={option.value} className={dropdownItemClasses} key={option.name}
                               onClick={handleItemClick}>{option.name}</li>;
                })}
            </ul>

        </div>}
    </div>;
}


Dropdown.propTypes = {
    options: PropTypes.array.isRequired,
    onItemClick: PropTypes.func,
    selectable: PropTypes.bool,
    ButtonIcon: PropTypes.element,
    buttonText: PropTypes.string,
    buttonClassName: PropTypes.string
};
Dropdown.defaultProps = {
    onItemClick: () => null,
    selectable: true,
};

export default React.memo(Dropdown);