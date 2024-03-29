// Copyright (c) 2009-2011 Mark Butler
// This program is free software; you can redistribute it
// and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation;
// either version 2 of the License, or (at your option) any later version.

// main classes for wargame

/**
 * Created by david on 2/19/17.
 */
/**
 * Created by PhpStorm.
 * User: david
 * Date: 2/19/17
 * Time: 9:38 PM

 /*
 * Copyright 2012-2017 David Rodal

 * This program is free software; you can redistribute it
 * and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation;
 * either version 2 of the License, or (at your option) any later version

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {DR} from './DR';
import fixHeader from './fix-header';
export var mute = false;

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


export function playAudio() {
    var aud = $('.pop').get(0);
    if (aud && !mute) {
        aud.play();
    }

}
export function playAudioLow() {
    var aud = $('.poop').get(0);
    if (aud && !mute) {
        aud.play();
    }

}
export function unMuteMe() {
    mute = false;
    return true;
}
export function muteMe() {
    mute = true;
    return true;
}
export function playAudioBuzz() {
    var aud = $('.buzz').get(0);
    if (aud && !mute) {
        aud.play();
    }

}

export function doitCRT(id) {
    DR.doPostRequest(id, COMBAT_PIN_EVENT);
}

export function drawHex(hexside, unit, isShort) {

    var decoration = isShort || "";
    var c = hexside - 0;
    var a = (c / 2);
    var b = .866 * c;
    var ac = a + c;
    var x = unit.x;
    var y = unit.y;
    var id = unit.id + decoration;
    var nat = DR.players[unit.forceId];
    var type = nat + '-' + unit.class;
    var cls = unit.class;
    var width = 2;
    var strokeDash = "1,0";

    if (unit.range > 7) {
        width = 4;
        strokeDash = "5,5";
    }
    if (unit.range > 11) {
        width = 6;
        strokeDash = "1,10";
    }

    x = x - b;
    y = y - c;

    var path = '<path stroke-dasharray="' + strokeDash + '" class="range-hex ' + nat + ' ' + decoration + ' ' + cls + '" stroke="transparent" id="rangeHex' + id + '" fill="#000" fill-opacity="0" stroke-width="' + width + '" d="M ' + x + ' ' + (ac + y) + ' L ' + x + ' ' + (a + y) + ' L ' + (b + x) + ' ' + y;
    path += ' L ' + (2 * b + x) + ' ' + (a + y) + ' L ' + (2 * b + x) + ' ' + (ac + y) + ' L ' + (b + x) + ' ' + (2 * c + y) + ' Z"></path>';

    $('#arrow-svg').append(path);
//        $('#arrow-svg').html($('#arrow-svg').html());
}

export function doitUnit(id, event) {
    var shiftKey = event.shiftKey;
    if (DR.shiftKey) {
        shiftKey = true;
        $("#shiftKey").click();
    }
    DR.doPostRequest(id, (event.metaKey || event.ctrlKey) ? SELECT_ALT_COUNTER_EVENT : (shiftKey || DR.shiftKey) ? SELECT_SHIFT_COUNTER_EVENT : SELECT_COUNTER_EVENT);
}
export function counterClick(event, unitId = null) {

    if (event.type == 'touchend') {
        event.stopPropagation();
        event.preventDefault();
    }

    DR.clickX = DR.clickY = undefined;
    if (DR.dragged) {
        DR.dragged = false;
        return;
    }
    if (event.which === 3) {
        return;
    }

    // var didDrag = $("#map").data('did-drag');
    // $("#map").data('did-drag', false);
    // if (didDrag) {
    //     return;
    // }

    if (event.altKey) {
        rotateUnits(event, this);
        return;
    }
    var id;
    if(unitId !== null){
        id = unitId;
    }else{
        id = $(event.target).attr('id');
        if (!id) {
            id = $(event.target).parent().attr("id");
        }
        if (!id) {
            id = $(event.target).parent().parent().attr("id");
        }
    }
    doitUnit(id, event);
}

export function mapClick(event) {

    if (DR.dragged) {
        DR.dragged = false;
        return;
    }

    var pixelX, pixelY;
    if(event.type === "touchend"){
        let page = event.changedTouches[0];
        pixelX = page.pageX;
        pixelY = page.pageY;
        var p;
        p = $("#gameImages").offset();
        pixelX -= p.left;
        pixelY -= p.top;
        pixelX /= DR.globalZoom;
        pixelY /= DR.globalZoom;
    }
    if(event.type === "click"){
        pixelX = event.offsetX;
        pixelY = event.offsetY;
    }

    // var p;
    // p = $("#gameImages").offset();
    // pixelX -= p.left;
    // pixelY -= p.top;
    if(!(event.metaKey || event.ctrlKey)) {
        return;
    }
    doitMap( pixelX, pixelY);
}

export function doitOption() {

    var checked = $("#options-box input[type='radio']:checked").val();
    if (checked === undefined) {
        playAudioBuzz();
        return;
    }
    DR.doPostRequest(checked, SELECT_BUTTON_EVENT);
}


export function doitNext(id = false) {
    const button = SELECT_BUTTON_EVENT;

    DR.doPostRequest(id, SELECT_BUTTON_EVENT);

}

export function nextPhaseMouseDown(event) {
    doitNext();
}

export function doitKeypress(key) {

    if(key < 27){
        return;
    }
    if(key > 27 && key < 37){
        return;
    }
    if(key > 40 && key < 65){
        return;
    }
    if(key > 90){
        return;
    }
    if(key == 27){
    }
    if(key === 82){
        return;
    }
    DR.doPostRequest(key, KEYPRESS_EVENT);
}


export function showCrtTable(mySelf) {
    if ($("#crt .switch-crt").length <= 1) {
        return;
    }
    $("#crt .tableWrapper").hide();
    $("#crt .switch-crt").hide();
    var id = $(mySelf).attr('id');
    $('#crt .' + id).show();
    var next = $(mySelf).next();
    if (next.length) {
        $(next).show();
    } else {
        $('#crt .switch-crt').first().show();
    }
}

export function fixItAll() {
    fixHeader();

}

export
function seeMap() {
    $(".unit").css("opacity", .0);
}
export function seeUnits() {
    $(".unit").css("opacity", 1.);
}
export function seeBoth() {
    $(".unit").css("opacity", .3);
}
export function showSurrender(){
    DR.globalZoom = 1.0;
    $("#zoom .defaultZoom").html(DR.globalZoom.toFixed(1));
    DR.$panzoom.panzoom('reset');
    $("#surrender").toggle();
}
export function surrender(){
    showSurrender();
    DR.doPostRequest(83, SURRENDER_EVENT);
}

export function doitSaveGame(msg){
    DR.doPostRequest(83, SAVE_GAME_EVENT, {msg: msg});
}

export function doitMap( x, y) {

    DR.doPostRequest(false, SELECT_ALT_MAP_EVENT, {x: x, y: y});
    return true;
}

export function rotateUnits(e, that) {
    if (e.ctrlKey) {
        return true;
    }
    var id = that.id;
    var x = DR.stackModel.ids[id].x;
    var y = DR.stackModel.ids[id].y;
    var units = DR.stackModel[x][y].ids;
    for (var i in units) {
        var zindex = $("#" + i).css('z-index') - 0;
        $("#" + i).css({zIndex: zindex + 1});
    }
    $(that).css({zIndex: 1});
    return false;
}

export function toggleFullScreen() {

    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
        $("#fullScreenButton i").removeClass("fa-arrows-alt").addClass("fa-compress");
    }
    else {
        cancelFullScreen.call(doc);
        $("#fullScreenButton i").addClass("fa-arrows-alt").removeClass("fa-compress");
    }
}

window.seeMap = seeMap;
window.seeUnits = seeUnits;
window.seeBoth = seeBoth;
window.surrender = surrender;
window.showSurrender = showSurrender;