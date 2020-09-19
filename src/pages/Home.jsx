import React, {useEffect, useState} from "react";
import {connect} from "react-redux"

import AppTopBar from "../components/home/AppTopBar";
import AppSideBar from "../components/home/AppSideBar";

import {cardsSelectors} from "../selectors/CardsSelectors";
import {getCards} from "../helpers/database";
import store from "../store/Store";
import {setCardsAction} from "../actions/CardsActions";

function Home({cards}) {
    const [isSideBarOpened, setIsSideBarOpened] = useState(false)

    useEffect(() => {
        getCards().then((doc) => {
            const data = doc.data()
            const cards = data.cards

            store.dispatch(setCardsAction(cards))
        })
    }, [])

    function handleToggleSideBar() {
        setIsSideBarOpened(isSideBarOpened => !isSideBarOpened)
    }


    return (
        <div className="home">
            <AppTopBar onToggleSideBarButtonClick={handleToggleSideBar}
                       isSideBarOpened={isSideBarOpened}/>
            <div className="content-wrapper">
                <AppSideBar isOpened={isSideBarOpened}/>
                <main className="main-content" style={{color: "white", zIndex: 1000}}>
                    {JSON.stringify(cards)}
                </main>
            </div>
        </div>
    )

}

function mapStateToProps(state) {
    return {
        cards: cardsSelectors(state),
    }
}

/*function mapDispatchToProps(dispatch) {
    return {

    }
}*/


export default connect(mapStateToProps)(Home)