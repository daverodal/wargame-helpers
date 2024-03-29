/**
 *
 * Copyright 2011-2015 David Rodal
 *
 *  This program is free software; you can redistribute it
 *  and/or modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation;
 *  either version 2 of the License, or (at your option) any later version
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/* to make module again, do this
 */

export  class Sync {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
        this.id = "Sync";
        this.callbacks = Object;
        this.lengths = {};
        this.timeTravel = false;
        this.fetchTimes = [];
        this.animate = false;
        this.fetched = false;
        this.initCallback = null;
        this.completeCallback = null;

    }

    fetchDone(callback){
        this.fetched = callback;
    }
    register(name, callback) {
        this.callbacks[name] = callback;
        this.lengths[name] = 0;
    }

    registerInit(callback) {
        this.initCallback = callback;
    }

    registerComplete(callback) {
        this.completeCallback = callback;
    }

    fetch(last_seq, args) {
        var chatsIndex = 0;
        var theArgs = {};
        if (args) {
            chatsIndex = parseInt(args.chatsIndex);
            theArgs = args;
        }
        var travel = "";
        if (this.timeTravel) {
            travel = "?timeTravel=" + last_seq;
        }
        if (this.timeBranch) {
            travel += "&branch=true";
            this.timeBranch = false;
            this.timeTravel = false;
        }
        if (this.timeFork) {
            travel += "&fork=true";
            this.timeFork = false;
            this.timeTravel = false;
        }
        let gotError = false;
        this.current = $.ajax(
            {
                url: this.baseUrl + "/" + last_seq + travel,
                type: "GET",
                data: theArgs,

                error:  (jqXHR, two, three) => {
                    console.log("in error ");
                    gotError = true;
                    //                    jqXHR.abort();
                },
                success:  (data, textstatus, jqXHR) => {
                    console.log("Success " + textstatus);
                    var now = ((new Date()).getTime()) / 1000;
                    this.fetchTimes.push(now);
                    if (this.fetchTimes.length > 10) {
                        var then = this.fetchTimes.shift();
                        // if ((now - then) < 2) {

                        //     $("#comlink").html("Comlink Down, Try refreshing Page");
                        //     return;
                        // }
                    }
                    var fetchArgs = {};
                    /* bleh ajax will automagically forward on 301's and 302's not letting me know
                     * if we got logged out. The only way I know is the object is no longer an object.
                     * So we redirect then
                     */
                    if (!(typeof data == "object" && data !== null)) {
                        /* get way out of app. to root */
                        window.location = '/';
                    }
                    /* detect if logged out and return forward data packet */
                    if (data.forward) {
                        window.location = data.forward;
                        return;
                    }
                    if(this.initCallback){
                        this.initCallback(data);
                    }
                    for (var i in this.callbacks) {
                        if (data[i]) {
                            if ($.isArray(data[i])) {
                                var lastlength = this.lengths[i];
                                data[i].splice(0, lastlength);
                            }
                            this.callbacks[i](data[i], data);
                            if (data[i + "Index"]) {
                                fetchArgs[i + "Index"] = data[i + "Index"];
                            }
                        }
                    }
                    if(this.completeCallback){
                        this.completeCallback(data);
                    }
                    last_seq = data.last_seq;
                    var msg = '<span title="' + last_seq + '">g</span>';
                    $("#comlink").html(msg);
                    $("#comlinkWrapper").css({background: 'lightgreen'})
                    if (!this.timeTravel) {
                        console.log("fetching ");
                        this.fetch(last_seq, fetchArgs);
                    }
                    if(this.fetched){
                        this.fetched();
                    }
                },
                complete: (jq, textstatus) => {
                    console.log('complete');
                    var now = ((new Date()).getTime()) / 1000;
                    this.fetchTimes.push(now);
                    if(gotError) {
                        return;
                    }
                    // if (this.fetchTimes.length > 10) {
                    //     var then = this.fetchTimes.shift();
                    //     if ((now - then) < 2) {
                    //         $("#comlink").html("Comlink Down, Try refreshing Page");
                    //         return;
                    //     }
                    // }
                    console.log("complete " + textstatus + " " + this.timeTravel);
                    if (textstatus != "success" && !this.timeTravel) {
                        // this.fetch(0);
                    }
                }
            });
    }

}
