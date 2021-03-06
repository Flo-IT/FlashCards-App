import PropTypes from "prop-types";
import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";

import "./CardFlipAnimation.scss";

function CardFlipAnimation({children, isBackShown}) {
    return <SwitchTransition mode={"out-in"}>
        <CSSTransition key={isBackShown}
                       addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                       classNames="Animation__Flip">
            {children}
        </CSSTransition>
    </SwitchTransition>;
}

CardFlipAnimation.propTypes = {
    children: PropTypes.node.isRequired,
    isCardBackShown: PropTypes.bool,
};


export default React.memo(CardFlipAnimation);