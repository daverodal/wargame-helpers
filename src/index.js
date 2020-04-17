import {playAudio, playAudioBuzz, playAudioLow, counterClick, mapClick, doitUnit, doitOption, doitNext, nextPhaseMouseDown, doitKeypress, showCrtTable, fixItAll, doitSaveGame, rotateUnits, toggleFullScreen, doitCRT} from "./global-funcs";
import {clickBack, phaseBack, playerTurnBack, clickSurge,phaseSurge, playerTurnSurge, timeLive, timeBranch} from "./time-funcs";
import {syncObj} from "./syncObj";
import fixHeader from "./fix-header";
export {fixHeader};
export {playAudio, playAudioBuzz, playAudioLow, counterClick, mapClick, doitUnit, doitOption, doitNext, nextPhaseMouseDown, doitKeypress, showCrtTable, fixItAll, doitSaveGame, rotateUnits, toggleFullScreen, doitCRT};
export {clickBack, phaseBack, playerTurnBack, clickSurge,phaseSurge, playerTurnSurge, timeLive, timeBranch};
export {syncObj};
import { doPostRequest } from "./doPostRequest";
export {doPostRequest};
import * as globalFuncs from "./global-funcs";
export {globalFuncs};
import {DR} from "./DR";
export {DR};
export default {
    install(Vue, options) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
    }
};
