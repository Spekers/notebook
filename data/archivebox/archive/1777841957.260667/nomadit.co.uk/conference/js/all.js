/** all.js adds several features to pages at nomadit.co.uk/conference/...
 *  and remote sites:
 *  * 'open link in modal iframe capability, used on timetable pages
 *  * 'open link in dropdown with html injection using remote auth ('/page/none' is appended to url) capability, used on timetable pages
 *  * messenger in an iframe!
 *  * messenger with html injection/remote auth (currently logged in only)
 *  * 'share buttons' touch/hover/pin popup.
 *  * 'copy to clipboard' used in share buttons
 *  * 'confirm to proceed' used for delete buttons.
 *  * news, using remote auth. remote auth, login not required for public news.
 *  * panel comments, using remote auth on remote sites, remote auth not required.
 *  * panel and paper stars, using remote auth. Only enabled for logged in people.
 *
 */

/* console shim */
+function () {
    if (!window.console) {
        var f = function () {};
        window.console = {log: f, info: f, warn: f, debug: f, error: f};
    }
}();

if (typeof (window.hasConferenceAllJS) !== 'undefined') {
    throw new Error("/conference/js/all.js added twice!");
}

window.hasConferenceAllJS = true;

if (!NomadITConferenceSite) {
    var NomadITConferenceSite = 'https://nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('www.nomadit') >= 0) NomadITConferenceSite = 'https://www.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('tst') >= 0) NomadITConferenceSite = 'https://tst.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('test') >= 0) NomadITConferenceSite = 'https://test.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('test2') >= 0) NomadITConferenceSite = 'https://test2.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('test81') >= 0) NomadITConferenceSite = 'https://test81.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('www.tst') >= 0) NomadITConferenceSite = 'https://www.tst.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('www.test') >= 0) NomadITConferenceSite = 'https://www.test.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('www.test2') >= 0) NomadITConferenceSite = 'https://www.test2.nomadit.co.uk/conference';
    if (window.location.hostname.indexOf('www.test81') >= 0) NomadITConferenceSite = 'https://www.test81.nomadit.co.uk/conference';
    // _ns support local dev envs
    if (window.location.hostname.indexOf('suitedev.app.lan') >= 0) NomadITConferenceSite = 'https://suitedev.app.lan/conference';
    if (window.location.hostname.indexOf('test.suitedev.app.lan') >= 0) NomadITConferenceSite = 'https://test.suitedev.app.lan/conference';
    if (window.location.hostname.indexOf('test2.suitedev.app.lan') >= 0) NomadITConferenceSite = 'https://test2.suitedev.app.lan/conference';
    if (window.location.hostname.indexOf('nomadit.net') >= 0) NomadITConferenceSite = 'https://nomadit.net/conference';
}

var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";
link.href = NomadITConferenceSite + '/css/dropdown-iframe.css';
document.getElementsByTagName('head')[0].appendChild(link);

jQuery(document).ready(function ($) {
    $('.no-js').removeClass('no-js');
    if ($('body').hasClass('message-js'))
        return;
    $('body').addClass('message-js');

    $('a.page-back').on('click', function () {
        $('body').addClass('page-back').addClass('unloading');
    });
    $('a.page-forward').on('click', function () {
        $('body').addClass('page-forward').addClass('unloading');
    });
    var serviceUrl;
    var afterDropdownCancelClickTarget;


    $('li.logged-in-menu-item a.dropdown-toggle').on('click', function (evt) {
        //console.log('menu toggle click');
        evt.preventDefault();
    });

    if (!$('body').hasClass('ajax-added')) {
        $('body').on('click', 'a.message-button', showPageInDropdownFrame);

        $('body').on('click', '.popup-confirm', function (evt) {
            //console.log('check if confirmed');
            var button = evt.currentTarget;
            var skipped = showConfirmationDropdown(button);
            if (skipped) {
                //console.log('is skipping');
                return true;
            }
            //console.log('not confirmed');
            evt.preventDefault();
            return false;
        });

        $('body').on('click', '.post-by-ajax', postByAjax);
        $('.post-by-ajax[type="submit"]').attr('type', 'button');
        $('body').on('click', '.reset-by-ajax', resetByAjax);
        $('body').on('click', '.post-by-ajax-confirm', postByAjaxConfirm);
        $('body').addClass('ajax-added');

        $('body').on('change', '*[data-must-not-exceed]', function(event){
            const inputA = $(event.currentTarget);
            //console.log('this cannot exceed ' + inputA.attr('data-must-not-exceed'));
            const inputB = $(inputA.attr('data-must-not-exceed'));
            if (inputA.val() > inputB.val()) {
                inputA.val(inputB.val());
                //console.log('this exceeded ' + inputB.val());
            }
        });

        $('body').on('change', '*[data-enforce-as-maximum]', function(event){
            const inputB = $(event.currentTarget);
            //console.log(inputB.attr('data-enforce-as-maximum') + ' cannot exceed this');
            const inputA = $(inputB.attr('data-enforce-as-maximum'));
            if (inputA.val() > inputB.val()) {
                inputA.val(inputB.val());
                //console.log(inputB.attr('data-enforce-as-maximum') + ' set to ' + inputB.val());
            }
        });

        window.setTimeout(function () {
            //allow FormInput.js to update inputs before storing initial state
            addFormDirtyHelpers();
            //console.log ('add unchanged props to ' + $('form.list-unchanged-properties').length + 'forms');
            $('form.list-unchanged-properties').each(function () {
                var form = $(this);
                form.on('submit', addUnchangedPropertiesList);
                var dataJson = parseFormData(form);
                form.attr('data-initial-data-json', JSON.stringify(dataJson));
                //console.log('add unchanged prop listener' + JSON.stringify(dataJson));
            });
        }, 100);
    }

    function parseFormData(form) {
        var dataJson = form.serializeArray().reduce(function (obj, item) {
            var nameLength = item.name.length;
            if (item.name.indexOf('[]') === (nameLength - 2)) {
                var name = item.name.substring(0, nameLength - 2);
                if (typeof obj[name] === 'undefined')
                    obj[name] = [item.value];
                else
                    obj[name].push(item.value);
            } else
                obj[item.name] = item.value;
            return obj;
        }, {});

        return dataJson;

    }

    function addUnchangedPropertiesList(event) {
        const form = $(event.currentTarget);
        let unchangedPropertiesHiddenInput = form.find('input[name=UnchangedPropertiesList');
        if (!unchangedPropertiesHiddenInput.length)
            unchangedPropertiesHiddenInput = $('<input name="UnchangedPropertiesList" type="hidden">').appendTo(form);
        let name, value;
        const formData = parseFormData(form);
        const oldData = JSON.parse(form.attr('data-initial-data-json'));
        //console.log('form:' + JSON.stringify(formData));
        //console.log('old:' + JSON.stringify(oldData));
        if (oldData == null)
            return;
        let unchanged = '';
        for (name in formData) {
            value = formData[name];
            if (JSON.stringify(value) === JSON.stringify(oldData[name])) {
                unchanged += (unchanged.length ? '-' : '') + name;
            }
        }
        //console.log('unchanged:' + unchanged);
        unchangedPropertiesHiddenInput.val(unchanged);
    }

    function addFormDirtyHelpers() {
        //now add form change listeners
        $('form.mark-if-dirty:not(.change-keyup-handler)').each(function () {
            var form = $(this);
            form.addClass('change-keyup-handler');
            var formData = form.serialize();
            var handlerWaiting = false;
            var fileInputChanged = false;
            form.on('change', '[type=file]', function () {
                fileInputChanged = true;
            });
            form.on('change keyup click update', '*', function () {
                if (!handlerWaiting) {
                    handlerWaiting = true;
                    window.setTimeout(function () {
                        handlerWaiting = false;
                        var newFormData = form.serialize();
                        if (!fileInputChanged && (formData == newFormData)) {
                            form.removeClass('dirty');
                            form.addClass('fresh');
                        } else {
                            if (!form.hasClass('dirty')) {
                                //now add page unload listener, once
                                if (!($('body').hasClass('check-for-unsaved-changes'))) {
                                    $('body').addClass('check-for-unsaved-changes');
                                    window.setTimeout(function () {
                                        var submitClicked = false;
                                        //console.log('ADDING "on unload" Handler');
                                        $('body')[0].onbeforeunload = function (evt) {
                                            if (!submitClicked && $('form.mark-if-dirty.dirty').length) {
                                                //console.log('UNSAVED CHANGES');
                                                return 'You have unsaved changes are you sure you want to leave the page?';
                                            } else {
                                                return null;
                                            }
                                        };
                                        $('form').on('submit', function (evt) {
                                            submitClicked = true;
                                            window.setTimeout(function () {
                                                submitClicked = false;
                                            }, 1000);
                                        });
                                    }, 100);
                                }

                            }
                            form.addClass('dirty');
                            form.removeClass('fresh');
                        }
                    }, 600);
                }
            });
        });
    }

    function postByAjaxConfirm(event) {
        var button = event.currentTarget;
        var skipped = showConfirmationDropdown(button);
        if (skipped) {
            //console.log('is confirmed');
            return postByAjax(event);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    function showConfirmationDropdown(button) {
        var ele = $(button);
        if (ele.hasClass('confirmed')) {
            return true
        }
        var isArrayItemRemove = ele.hasClass('remove-array-item');
        var personFinderLastName = ele.closest('.array-item').find('.person-finder .input-lastname');
        var personFinderFirstName = ele.closest('.array-item').find('.person-finder .input-firstname');
        if (personFinderLastName.length && personFinderFirstName.length) {
            if (!personFinderLastName.val() && !personFinderFirstName.val()) {
                ele.addClass('confirmed');
                window.setTimeout(function () {
                    //console.log('person not set - skip confirmation');
                    ele.click();
                }, 20);
                return true;
            }
        }
        var toRemove;

        //console.log('confirmation required');
        var confirmText = button.getAttribute('data-confirmtext');
        if (!confirmText) {
            confirmText = 'Are you sure you want to ' + $(button).text() + '';
        }
        var dropDownStyle = button.getAttribute('data-dropdown-style-class');
        if (!dropDownStyle) {
            dropDownStyle = '';
        }
        var confirmYes = button.getAttribute('data-confirmyes');
        if (!confirmYes) {
            confirmYes = 'Proceed';
        }
        var confirmNo = button.getAttribute('data-confirmno');
        if (!confirmNo) {
            confirmNo = 'Cancel';
        }
        var confirmButtonClass = button.getAttribute('data-confirm-btn-class');
        if (!confirmButtonClass) {
            confirmButtonClass = 'btn-danger';
        }

        if (ele.hasClass('remove-table-row')) {
            toRemove = ele.closest('tr').find('td');
            toRemove.addClass('label-danger').addClass('label-danger-added');
        }
        if (isArrayItemRemove) {
            ele.closest('.array-item').addClass('label-danger').addClass('label-danger-added');
        }
        var container = $('#conference-sweet');
        if (container.length <= 0) container = $('body');

        var dialog = $(
            '<div class="backdrop dropdown-cancel">' +
            '</div>' +
            '<div class="dropdown-dialog-container ' + dropDownStyle + '">' +
            '  <div class="dropdown-dialog">' +
            '    <div class="dropdown-head">' +
            confirmText +
            '    </div>' +
            '    <div class="dropdown-foot">' +
            '       <button class="btn btn-secondary dropdown-cancel">' + confirmNo + '</button>' +
            '       <button class="btn ' + confirmButtonClass + ' confirmation-proceed">' + confirmYes + '</button>' +
            '    </div>' +
            '  </div>' +
            '</div>'
        );
        dialog.appendTo(container);
        $('body').addClass('content-expanded');
        $('.dropdown-cancel').focus();
        dialog.on('click', '.confirmation-proceed', function () {
            //console.log('proceeding with click on "' + $(button).text() + '".');
            $(button).addClass('confirmed');
            $('body').removeClass('content-expanded');
            $('.backdrop').remove();
            $('.dropdown-dialog-container').remove();
            window.setTimeout(function () {
                //console.log('do click that was confirmed')
                $(button).click();
            }, 150);
            window.setTimeout(function () {
                $(button).removeClass('confirmed');
            }, 500);
        });
        return false;
    }

    function getChangedAndHiddenDataFromForm(form) {
        var name, value;
        var formData = parseFormData(form);
        var oldData = JSON.parse(form.attr('data-initial-data-json'));
        //console.log('form:' + JSON.stringify(formData));
        //console.log('old:' + JSON.stringify(oldData));
        if (!oldData)
            return formData;
        var changedAndHidden = {};
        var notes = '<br>';
        for (name in formData) {
            value = formData[name];
            if ((JSON.stringify(value) === JSON.stringify(oldData[name]))) {
                if (form.find('input[name="' + name + '"][hidden]').length === 0) {
                    notes = notes + name + ' unchanged. ';
                } else {
                    notes = notes + name + ' = ' + value + '(hidden). ';
                    changedAndHidden[name] = JSON.stringify(value);
                }
            } else {
                notes = notes + name + ' CHANGED FROM ' + JSON.stringify(oldData[name]) + ' TO ' + JSON.stringify(value) + '. ';
                changedAndHidden[name] = value;
            }

        }
        //console.log(notes);
        //console.log('Changes and Hidden ' + JSON.stringify(changedAndHidden));
        alert(notes);
        return JSON.stringify(changedAndHidden);
    }

    function postByAjax(event) {
        event.preventDefault();
        event.stopPropagation();
        var button = event.currentTarget;
        var formData = JSON.parse(button.getAttribute('data-ajax-data'));
        var buttonName = button.getAttribute('name');
        var buttonValue = button.getAttribute('value');
        if (!!formData) {
            return postFormByAjax($(button), formData);
        }

        var form = $(event.currentTarget).closest('form');
        if (form.length) {
            if (form.get(0).checkValidity()) {
                form.submit(false);
                formData = form.serialize();
                if (buttonName && buttonValue) {
                    //console.log('adding input name and value ' + buttonName + ' = ' + buttonValue);
                    formData += '&' + buttonName + '=' + buttonValue;
                }
                if (formData) {
                    return postFormByAjax($(form), formData);
                }
            } else {
                form.get(0).reportValidity();
            }
        }
        console.log('No data to post');
        return false;
    }

    function resetByAjax(event) {
        var button = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        var element = $(event.currentTarget).closest('form');
        var serviceUrl = element.attr('data-ajax-uri');
        var responseSelector = element.attr('data-ajax-response-container');
        var responseContainer;
        if (responseSelector) {
            responseContainer = $(responseSelector);
        } else {
            let responseElementSelector = element.attr('data-ajax-response-element');
            responseContainer = $(responseElementSelector).parent();
        }
        responseContainer.removeClass('updating');
        nomadRequest(serviceUrl, {}, function (responseHtml) {
            if (responseContainer.hasClass('ajax-replacable'))
                responseContainer.replaceWith(responseHtml);
            else {
                responseContainer.html(responseHtml);
                responseContainer.removeClass('updating');
            }
            console.log('ajax html added to page');
            window.setTimeout(function () {
                addFormDirtyHelpers();
                $('body').trigger('commentable-content-added');
            }, 2);
        });
        return false;
    }

    var clickedOnce = [];

    function postFormByAjax(element, formData) {
        var serviceUrl = element.attr('data-ajax-uri');
        if (!serviceUrl) {
            console.log('Cant post by ajax - No service-uri');
            return true;
        }

        var responseSelector = element.attr('data-ajax-response-container');
        var responseContainer=[];
        var responseShouldContain = '';
        if (responseSelector) {
            responseContainer = $(responseSelector);
        } else {
            responseSelector = element.attr('data-ajax-response-element');
            if (responseSelector) {
                responseShouldContain = responseSelector.substring(1);
                //console.log('response selector: ' + responseSelector);
                responseContainer = $(responseSelector).parent();
            }
        }
        if (!responseContainer.length) {
            responseContainer = element.closest('form');
        }
        if (!responseContainer.length) {
            console.log('Cant post by ajax - No response-container');
            return true;
        }

        $.post(serviceUrl, formData, function (responseHtml) {
            if (responseShouldContain.length && responseHtml.toLowerCase().indexOf(responseShouldContain) == -1) {
                responseHtml = responseHtml + responseContainer.html();
            }
            if (responseContainer.hasClass('ajax-replacable')){
                responseContainer.replaceWith($(responseHtml));
            } else {
                responseContainer.html(responseHtml);
            }
            console.log('ajax html added to page');

            window.setTimeout(function () {
                addFormDirtyHelpers();
                $('body').trigger('commentable-content-added');
            }, 2);

            if (element.hasClass('refresh-page-after-change')) {
                window.setTimeout(function() {
                    window.location.replace(
                        window.location.pathname+ window.location.search + window.location.hash
                    );
                },600);
            }

        });
        return false;
    }

    $('body').on('click', '.dropdown-cancel', function (e) {
        $('.backdrop').fadeOut(function () {
            $('body').removeClass('content-expanded');
            $('.backdrop').remove();
            $('.focus-after-dropdown-close').removeClass('focus-after-dropdown-close').focus();
        });
        $('.label-danger-added').removeClass('label-danger').removeClass('label-danger-added');

        $('.dropdown-container,.dropdown-dialog-container').remove();
        if (!afterDropdownCancelClickTarget) {
            e.preventDefault();
        }
    });

    $('body').on('click', 'a.play-clip-button', function (evt) {
        var button = $(evt.currentTarget);
        var audioUrl = button.attr('data-clip');
        //console.log(' - play audio ' + audioUrl);
        if (!audioUrl) audioUrl = button.attr('href');
        //console.log(button.text() + ' - play audio ' + audioUrl);
        var audio = new Audio(audioUrl);
        audio.play();
        evt.preventDefault();
        evt.stopPropagation();
        button.addClass('active');
        button.css('color', '#E0E');
        window.setTimeout(function () {
            button.removeClass('active');
            button.css('color', '#888');
        }, 7000);
    });

    $('body').on('mouseenter', 'a.click-on-hover, span[data-prop=PersonID]', hoverClickStart);
    $('body').on('mouseleave', 'a.click-on-hover, span[data-prop=PersonID]', hoverClickStop);
    $('body').on('click', 'a.click-on-hover, span[data-prop=PersonID], div[data-prop=PersonID]', hoverClickClicked);
    var hoverStartTime;
    var never = Date.now() * 2;
    var HOVER_CLICK_DELAY = 700;

    function hoverClickStart(evt) {
        var button = $(evt.currentTarget);
        if (button.hasClass('clicked'))
            return;
        $('.click-on-hover.active').removeClass('active').css('box-shadow', 'none');
        button.addClass('active').addClass('click-on-hover');
        button.css('transition', 'box-shadow 0.2s linear');
        button.css('box-shadow', '0 0 2px 2px #FBF');
        hoverStartTime = Date.now();
        window.setTimeout(function () {
            if (hoverStartTime + HOVER_CLICK_DELAY / 3 < Date.now()) {
                button.css('box-shadow', '0 0 3px 3px #FAF');
                window.setTimeout(function () {
                    if (hoverStartTime + HOVER_CLICK_DELAY * 2 / 3 < Date.now()) {
                        button.css('box-shadow', '0 0 7px 7px #F9A');
                        window.setTimeout(function () {
                            if (hoverStartTime + HOVER_CLICK_DELAY < Date.now()) {
                                button.css('box-shadow', '0 0 3px 3px #A4F');
                                hoverStartTime = never;
                                button.click();
                            } else cancelHover(button);
                        }, HOVER_CLICK_DELAY / 3);
                    } else cancelHover(button);
                }, HOVER_CLICK_DELAY / 3);
            } else cancelHover(button);
        }, HOVER_CLICK_DELAY / 3);
    }

    function hoverClickStop(evt) {
        var button = $(evt.currentTarget);
        cancelHover(button);
        hoverStartTime = never;
    }

    function hoverClickClicked(evt) {
        var button = $(evt.currentTarget);
        $('.click-on-hover.clicked').removeClass('clicked');
        button.addClass('clicked');
        hoverStartTime = never;
    }

    function cancelHover(button) {
        button.removeClass('active').css('box-shadow', 'none');
    }

    $('body').on('click', 'a.btn-close-popper', closePopper);

    function closePopper(evt) {
        evt.preventDefault();
        var button = $(evt.currentTarget);
        button.closest('.popper').remove();
        $('.click-on-hover.clicked').removeClass('clicked');
        $('.focus-after-popper-close').removeClass('focus-after-popper-close').focus();
    }

    $('body').on('click', 'a.content-popper-button', showPageInPopper);
    $('body').on('click', '*[data-prop=PersonID]', showPageInPopper);

    function getStyle(element, styleProp) {
        val = '';
        if (element.currentStyle)
            val = element.currentStyle[styleProp];
        else if (window.getComputedStyle)
            val = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
        return val;
    }

    function showPageInPopper(evt) {
        console.log('Show in popper');
        var anchor = evt.currentTarget || evt.target;
        if (anchor.tagName.toLowerCase() != 'a' && anchor.getAttribute('data-prop') != 'PersonID') {
            anchor = anchor.parentElement;
            if (anchor.tagName.toLowerCase() != 'a') {
                console.log('Error: button is a ' + anchor.tagName)
            }
        }
        var popperContainerSelector='.popper-container';
        var popperContainer = $(anchor).closest(popperContainerSelector);
        if (popperContainer.length <= 0){
            popperContainerSelector='#conference-sweet';
            popperContainer = $(anchor).closest(popperContainerSelector);
        }
//        if (popperContainer.length <= 0) popperContainer = $('main');
        if (popperContainer.length <= 0){
            popperContainerSelector='body';
            popperContainer = $(popperContainerSelector);
        }
//        console.log('container ' + popperContainerSelector +
//            ' position '+popperContainer.css('position'));
        if (popperContainer.css('position')=='static')
            popperContainer.css('position', 'relative');
//        console.log('container ' + popperContainerSelector +
//            ' position '+popperContainer.css('position'));

        var serviceUrl = anchor.getAttribute('href');
        var usePreviousCache = serviceUrl && (serviceUrl.indexOf('/reviewer/')<0);
        if (!serviceUrl && anchor.getAttribute('data-prop') === 'PersonID') {
            var PersonID = parseInt(anchor.getAttribute('data-val'));
            if (!PersonID) PersonID = parseInt($(anchor).text());
            if (PersonID) serviceUrl = getConferenceUrl($(anchor));
            if (serviceUrl) serviceUrl += '/participant/' + PersonID;
        }
        if (!serviceUrl) {
            console.log('Error: failed to get popup url');
            //console.log('button is a ' + anchor.tagName + ' href=' + serviceUrl + ' t=' + $(anchor).text());
            return
        }
        console.log('popper url '+serviceUrl);
        if (serviceUrl.indexOf('/conference/') >= 0) {
            serviceUrl = serviceUrl.replace('/page/embed', '');
            serviceUrl = serviceUrl.replace('/page/none', '');
            if (serviceUrl.indexOf('/?') > 0)
                serviceUrl = serviceUrl.replace('/?', '/page/none/?');
            else
                serviceUrl = serviceUrl + '/page/none';
        }
        evt.preventDefault();
        evt.stopPropagation();
        $('.focus-after-popper-close').removeClass('focus-after-popper-close');
        anchor.classList.add('focus-after-popper-close');
        console.log('service ' + serviceUrl);

        if (serviceUrl === fetchingPopperUrl) {
            //ignore first click on same button if fetching data
            fetchingPopperUrl = null;
            return;
        }
        var existingPopper = $('.popper');
        if (existingPopper.length) {
            existingPopper.remove();
            if (serviceUrl === previousPopperUrl)
                return;
        }

        var popper = $(
            '<div class="popper p-1 m-0">' +
            '<div class="top-line" style="text-align: right">' +
            '   loading . . . ' +
            '   <a href="#close" style="color:#411" class="btn btn-close-popper click-on-hover">' +
            '     <span class="glyphicon glyphicon-remove"></span>' +
            '   </a>' +
            '</div>' +
            '</div>'
        );
        popper.fadeIn().appendTo(popperContainer);

        var position = getElementOffset(anchor, popperContainerSelector);

        popper.css('position', 'absolute');
        popper.css('background-color', '#FFF');
        popper.css('box-shadow', '1 1 2 2 #888');
        popper.css('color', '#222');
        popper.css('z-index', '99');
        popper.css('border-radius', '0.5em');
        popper.css('box-shadow', '0 0 1px 1px #AAA,0 0 1px 3px #444');
        popper.css('padding', '0.7en');

        var containerWidth = popperContainer.width();
        var containerHeight = popperContainer.height();
        var width = Math.min(600, containerWidth * .7);

        if (containerWidth < 800) {
            popper.css('left', 5);
            popper.css('width', 'auto');
            popper.css('right', 5);
        } else if ((containerWidth / 2 - position.X) > 0) {
            popper.css('left', Math.min(position.X, containerWidth - width - 5));
            popper.css('width', width)
        } else {
            popper.css('right', Math.max(5, containerWidth - position.X - $(anchor).width()));
            popper.css('width', width)
        }
        var showPopperBelow = (position.Y < 1000 || ($(window).height() / 2 - (position.Y - jQuery(window).scrollTop())) > 0);
        if (showPopperBelow) {
            console.log('show below posY'+position.Y+' aHeight'+ $(anchor).height() )
            popper.css('top', position.Y + $(anchor).height() + 14);
            popper.css('bottom', 'auto');
        } else {
            console.log('show above  cont Height'+ containerHeight +'-posY'+position.Y )
            popper.css('bottom', containerHeight - position.Y + 3);
            popper.css('top', 'auto');
        }

        popperUrl = serviceUrl;
        /*optimise - no refetch if same as previous one*/
        if (usePreviousCache && popperUrl === previousPopperUrl) {
            console.log('using previous fetched data for ' + serviceUrl);
            handlePopperContent(previousPopperContent);
        } else {
            console.log('fetching from ' + serviceUrl);
            fetchingPopperUrl = popperUrl;
            nomadRequest(serviceUrl, {}, handlePopperContent);
        }

        function handlePopperContent(content) {
            if (fetchingPopperUrl)
                window.setTimeout(function () {
                    /* double clicks on the same button are ignored until this is nulled */
                    fetchingPopperUrl = null
                }, 500);

            //console.log($('ul a.nav-link.dropdown-toggle.show').length + ' open dropdowns');
            $('ul a.nav-link.dropdown-toggle.show').removeClass('show').attr('aria-expanded', 'false');
            $('ul.dropdown-menu.show').removeClass('show');

            previousPopperUrl = popperUrl;
            previousPopperContent = content;

            if (popper.closest('#conference-sweet').length > 0)
                content = '<div>' + content + '</div>';
            else
                content = '<div id="conference-sweet">' + content + '</div>';

            let closeDiv = '<div class="top-line" style="text-align: right">' +
                '   <a href="#close" style="color:#311" class="btn btn-close-popper click-on-hover">' +
                '   <span class="glyphicon glyphicon-remove"></span></a>' +
                '</div>';

            if (showPopperBelow)
                popper.html(closeDiv + content);
            else
                popper.html(content + closeDiv);

            window.setTimeout(function() {
                //console.log('focus on popper close button '+$('.popper .btn-close-popper').length);
                $('.popper .btn-close-popper').focus();
            }, 20);
        }
    }

    var popperUrl, previousPopperUrl, previousPopperContent, previouspreviousPopperUrl, previouspreviousPopperContent,
        fetchingPopperUrl;

// see https://gist.github.com/pocketjoso/6f3f5483226e12fb3f6c21c239d9e121
    function getElementOffset(el, parentSelector) {
        var top = 0
        var left = 0
        // grab the offset of the element relative to it's parent,
        // then repeat with the parent relative to it's parent,
        // ... until we reach an element without parents.
        do {
            top += el.offsetTop
            left += el.offsetLeft
            el = el.offsetParent
            if ($(el).is(parentSelector))
                el = null;
        } while (el)

        return {Y: top, X: left}
    }

    /**
     * <a class="iframe-dropdown-button" href="https://nomadit.co.uk/conference/ecas2019/days/date/2019-06-14">
     *     wednesday timetable
     * </a>
     */

    $('body').on('click', 'a.content-dropdown-button', showPageInDropdownFrame);
    $('body').on('click', 'a.iframe-dropdown-button', showPageInDropdownFrame);

    function showPageInDropdownFrame(evt) {
        evt.preventDefault();
        var button = evt.currentTarget || evt.target;
        if (button.tagName.toLowerCase() != 'a') {
            button = button.parentElement;
        }
        if (button.tagName.toLowerCase() != 'a') {
            console.log('Error: button is a ' + button.tagName)
        }

        var iframeTitle;
        var useIframe = button.classList.contains('iframe-dropdown-button');
        if (useIframe && evt.ctrlKey) {
            console.log("ctr key was pressed during the click, do default action");
            return;
        }
        button.classList.add('focus-after-dropdown-close');
        //console.log('use Iframe=' + useIframe)
        iframeTitle = button.getAttribute('data-dropdown-title');
        if (!iframeTitle)
            iframeTitle = button.innerHTML.split(': ')[0]; // ignore any text after a colon in the frame title- (excludes author name from frame title in author messenger iframe)
        if (!iframeTitle) {
            console.log('Error: failed to read button text for iframe title');
            return
        }
        var serviceUrl = button.getAttribute('href');
        if (!serviceUrl) {
            console.log('Error: failed to read button url');
            return;
        }
        if (serviceUrl.indexOf('/conference/') >= 0) {
            serviceUrl.replace('/page/embed', '');
            serviceUrl.replace('/page/none', '');
            if (useIframe)
                serviceUrl = serviceUrl + '/page/embed';
            else
                serviceUrl = serviceUrl + '/page/none';
        }
        if (serviceUrl.indexOf('/mecon/addons/') >= 0) {
            if (serviceUrl.indexOf('?') >= 0)
                serviceUrl = serviceUrl + '&page=embed';
            else
                serviceUrl = serviceUrl + '?page=embed';
        }
        var closeButtonHtml;
        var closeButtonText = button.getAttribute('data-close-button-text');
        if (!closeButtonText)
            closeButtonText = 'Close';

        var dropDownStyle = button.getAttribute('data-dropdown-style-class');
        if (!dropDownStyle)
            dropDownStyle = '';

        var dropDownTopStyle = button.getAttribute('data-dropdown-top-style-class');
        if (!dropDownTopStyle)
             dropDownTopStyle = '';
        var topHtml = '';
        var tabButtonGroup = button.getAttribute('data-dropdown-top-link-select');
        if (tabButtonGroup) {
            //console.log('tab links: ' + $(tabButtonGroup).length);
            $(tabButtonGroup).each(function () {
                topHtml += this.outerHTML.replace('wide-box', 'wide-fade-box')
            });
        }
        dropDownTopStyle = '';

        var closeButtonNextClick = button.getAttribute('data-click-after-close');

        if (!closeButtonNextClick) {
            closeButtonHtml =
                ' <button class="btn btn-secondary dropdown-cancel pull-right"> '
                + closeButtonText +
                '</button>';
            afterDropdownCancelClickTarget = null;
        } else {
            afterDropdownCancelClickTarget = $(closeButtonNextClick);
            closeButtonHtml =
                ' <a href="' + afterDropdownCancelClickTarget.attr('href') + '" class="btn btn-default dropdown-cancel pull-right"> '
                    + closeButtonText +
                '</a>';
        }

        evt.preventDefault();

        var containerSelector = '#conference-sweet';
        if ($(containerSelector).length === 0)
            containerSelector = '#content';

        $(
            '<a href="#" class="backdrop dropdown-cancel">' +
            '</a>' +
            '<div class="dropdown-container ' + dropDownStyle + '">' +
            '  <div class="dropdown-body" style="overflow: auto!important; -webkit-overflow-scrolling: touch!important;">' +
            '    <div class="dropdown-top ' + dropDownTopStyle + '">' +
            closeButtonHtml +
            '<span class="d-inline-block p-2 iframe-title">' + iframeTitle + '</span>' +
            topHtml +
            '    </div>' +
            (useIframe ? ('    <iframe src="' + serviceUrl + '"></iframe>')
                : ('    <div id="remote-content-frame"></div>')) +
            '  </div>' +
            '</div>'
        ).appendTo(containerSelector);
        //console.log('appended to sweet '+containerSelector);
        if (!useIframe) {
            nomadRequest(serviceUrl, {}, handleFrameContent)
        }
        $('body').addClass('content-expanded');
        window.setTimeout(function () {

            $('div.dropdown-top .sr-only').removeClass('sr-only');
            $('div.dropdown-top .dropdown-cancel').focus().css('box-shadow','5 5 5 5 red');
            console.log('found '+$('div.dropdown-top .dropdown-cancel').length+' cancel button ');
        }, 20)
    }

    function handleFrameContent(content) {
        /* put fetched html with div #conference-sweet to use panel and schedule css */
        $('#remote-content-frame').html('<div id="conference-sweet">' + content + '</div>');
        /* links ton conference pages fetch the html with ajax
           (with RA if available) then put html into the same div id */

        window.setTimeout(function () {

            /* Remote content links handled with nomad Request, (for logged in content on remote pages to be hanfdled with RA) Not used and breaks the audio captch play button
            $('#remote-content-frame a').on('click', function (evt) {
                var button = evt.currentTarget;
                var url = button.getAttribute('href');
                evt.preventDefault();
                console.log('u=' + url + ' s=' + NomadITConferenceSite);
                if (url.indexOf('/conference/') >= 0) {
                    url = url.replace('/page/embed', '');
                    url = url.replace('/page/none', '');
                    if(url.indexOf('/conference/') == 0)url = url.replace('/conference', NomadITConferenceSite);
                    url = url + '/page/none';
                }
//                console.log('u=' + url + ' s=' + NomadITConferenceSite);
                nomadRequest(url, {}, handleFrameContent)
            });
            */
            //used for messenger
            $('#remote-content-frame form.messenger').on('submit', function (evt) {
                evt.preventDefault();
                var button = $(evt.currentTarget);
                var form = button.closest('form');
                form.find('button[type=submit]').prop('disabled', 'disabled');
                var formData = form.serializeArray().reduce(function (obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {}); //Note: array type not supported , assumes one value per property
                formData = addNomadAuth(formData);
                $.post(form.attr('action'), formData, function (response) {
                    if (response.success && response.success.message)
                        form.parent().html('<div class="wrap-text label-lg label bg-success">' + response.success.message + '</div>');
                    else if (response.error)
                        form.parent().html('<div class="wrap-text label-lg label bg-danger">Not sent: ' + response.error + '</div>');
                    else
                        form.parent().html('<div class="wrap-text label-lg label bg-danger">Error sending message</div>');
                });
            });
        }, 50);

    }

    /* sharing on panel page */
    var shareToggleHovering = false;
    $('body').on('click', '.share-toggle', function (event) {
        shareToggleHovering = false;
        event.preventDefault();
        var parentContainer = $(event.currentTarget).parent();
        if (parentContainer.hasClass('in') && parentContainer.hasClass('clicked')) {
            parentContainer.removeClass('in').removeClass('clicked');
        } else {
            parentContainer.addClass('in').addClass('clicked');
        }
    });
    $('body').on('mouseenter', '.share-toggle', function (event) {
        var parentContainer = $(event.currentTarget).closest('.share-buttons');
        if (!parentContainer.hasClass('in')) {
            shareToggleHovering = true;
            window.setTimeout(function () {
                if (shareToggleHovering) {
                    //console.log('still hovering 400ms later ...');
                    shareToggleHovering = false;
                    if (parentContainer.hasClass('in')) {
                        parentContainer.removeClass('in');
                    } else {
                        parentContainer.addClass('in');
                    }
                }
            }, 400)
        }
    });
    $('body').on('mouseout', '.share-buttons', function (event) {
        if ($(event.relatedTarget).closest('.share-buttons').length) return;
        var parentContainer = $(event.currentTarget).closest('.share-buttons');
        shareToggleHovering = false;
        if (!parentContainer.hasClass('clicked')) {
            parentContainer.removeClass('in');
        }
    });
    var oneTabbedIn = false;
    $('body').on('focus', 'a', removeTabbedInStatusFromShareButtons);
    $('body').on('focus', '.share-buttons a', function (event) {
        if ($(event.currentTarget).closest('.share-buttons').length) {
            removeTabbedInStatusFromShareButtons();
            $(event.currentTarget).closest('.share-buttons').addClass('in').addClass('tabbed-in');
            oneTabbedIn = true;
        }
    });
    $('body').on('mouseout', '.share-toggle', function (event) {
        if ($(event.relatedTarget).closest('.share-toggle').length) return;
        shareToggleHovering = false;
    });

    function removeTabbedInStatusFromShareButtons() {
        if (oneTabbedIn) {
            $('.share-buttons.tabbed-in:not(.clicked-in)').removeClass('in');
            $('.share-buttons.tabbed-in').removeClass('tabbed-in');
            oneTabbedIn = false;
        }
    }

    /*** 'copy to clipboard' used in share buttons */
    $('body').on('click', ".copy-button", function (evt) {
        var elem = evt.currentTarget;
        evt.preventDefault();
        copyToClipboard(elem);
        $('.copied').removeClass('copied');
        $(elem).addClass('copied');
        window.setTimeout(function () {
            $(elem).on('touchstart mouseenter focus', function (evt) {
                var elem = evt.currentTarget;
                $(elem).removeClass('copied');
                window.setTimeout(function () {
                    $(elem).off('touchstart mouseenter focus');
                }, 50);
            });
        }, 1000);
    });

    function copyToClipboard(elem) {
        /* create hidden text element, if it doesn't already exist */
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName.toUpperCase() === "INPUT" || elem.tagName.toUpperCase() === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            /* can just use the original source element for the selection and copy */
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            /* must use a temporary form element for the selection and copy */
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                elem.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        /* select the content */
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        /* copy the selection */
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }
        /* restore original focus */
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        if (isInput) {
            /* restore prior selection */
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            /* clear temporary content */
            target.textContent = "";
        }
        return succeed;
    }


    /* Open mailto link, from https://stackoverflow.com/questions/8549816/open-the-href-mailto-link-in-new-tab-window (Sampson Crowley's June 2018 answer)*/
    $('body').on('click', 'a[href^=mailto]', function (e) {
        var checkClose, checkLoaded, event, href, i, len, loadEvents, results, t, mailWindow;
        e.preventDefault();
        href = this.href;
        mailWindow = window.open(href, 'mail');
        checkClose = function () {
            try {
                mailWindow.location.href;
                return mailWindow.close();
            } catch (error) {
                return;
            }
        };
        t = setTimeout(checkClose, 5000);
        try {
            checkLoaded = function () {
                clearTimeout(t);
                return t = setTimeout(checkClose, 2000);
            };
            mailWindow.onload = checkLoaded;
            loadEvents = ["DomContentLoaded", "load", "beforeunload", "unload"];
            results = [];
            for (i = 0, len = loadEvents.length; i < len; i++) {
                event = loadEvents[i];
                results.push(mailWindow.addEventListener(event, checkLoaded));
            }
            return results;
        } catch (error) {
            return checkLoaded();
        }
    });
    /*
       Star and unstar timtable actions
    */
    $('body').on('click', '.tt-star.glyphicon', function (evt) {
        var starEle = $(evt.currentTarget);
        evt.preventDefault();
        if (starEle.closest('.timetable-row').hasClass('session')) {
            if (starEle.closest('.timetable-row').find('.collapse.in').length === 0)
                starEle.closest('.timetable-row').find('button.tt-button').click();
            return;
        }
        if (starEle.hasClass('not-logged-in')) {
            alert('Only logged in users can star content');
            return;
        }
        var TimeTableRowID = starEle.attr("data-ttid");
        if (typeof TimeTableRowID == 'undefined') {
            console.log('Error: failed to act on star click - cant find TimeTableRowID');
            return;
        }
        //console.log(' closest row found = ' + starEle.closest('.timetable-row').length);

        doStarAction(starEle, {'TimeTableRowID': TimeTableRowID});
    });
    /*
       Star and unstar panel actions
    */
    $('body').on('click', '.panel-star.glyphicon', function (evt) {
        evt.preventDefault();
        var starEle = $(evt.currentTarget);
        if (starEle.hasClass('not-logged-in')) {
            alert('Only logged in users can star content');
            return;
        }
        var PanelID = starEle.parent().find('[data-prop="PanelID"]').attr("data-val");
        if (typeof PanelID == 'undefined') {
            console.log('Error: failed to act on star click - cant find panelID');
            return;
        }
        doStarAction(starEle, {'PanelID': PanelID});
    });
    /*
     Star and unstar paper actions
    */
    $('body').on('click', '.paper-star.glyphicon', function (evt) {
        //console.log('paper star clicked');
        evt.preventDefault();
        var starEle = $(evt.currentTarget);
        var PaperID = starEle.attr("data-paperid");
        if (typeof PaperID == 'undefined') {
            PaperID = starEle.closest('.paper').find('[data-prop=PaperID]').first().attr("data-val");
        }
        if (!PaperID) {
            console.log('Error: failed to act on paper star click - no PaperID');
            return;
        }
        var PanelID = starEle.attr("data-panelid");
        if (typeof PanelID == 'undefined') {
            PanelID = starEle.closest('.paper').find('[data-prop=PanelID]').first().attr("data-val");
        }
        if (typeof PanelID == 'undefined') {
            PanelID = starEle.closest('.paper').attr("data-panelid");
        }
        if (typeof PanelID == 'undefined') {
            console.log('Error: failed to act on paper star click - no panelid');
            return;
        }
        doStarAction(starEle, {'PanelID': PanelID, 'PaperID': PaperID});
    });

    function removeComments(hideButton) {
        var commentDiv = hideButton.closest('.comments-div');
        var commentRemoteContent = commentDiv.children('.comments-list').first();
        commentRemoteContent.html('');
        commentDiv.removeClass('fetched')
        commentDiv.addClass('unfetched')
    }

    function loadComments(fetchButton) {
        var commentDiv = fetchButton.closest('.comments-div');
        var commentRemoteContent = commentDiv.children('.comments-list').first();
        var data = getCommentTargetData(commentDiv);
        var serviceUrl = getCommentServiceUrl(commentDiv, data)
        data.action = 'getComments';
        $.post(serviceUrl, data, function (result) {
            commentRemoteContent.html(result);
            commentDiv.removeClass('unfetched')
            commentDiv.addClass('fetched')
        });
    }

    /*
        Load comments on click
    */
    $('body').on('click', '.panel .fetch-comments-button', function (evt) {
        var target = $(evt.currentTarget);
        if (target.closest('.panel-meta').length
            && target.attr('href').indexOf('#panel-comments') === 0) {
            target = $(target.attr('href'));
        } else {
            evt.preventDefault();
        }
        loadComments(target);
    });
    /*
         Hide comments on click
    */
    $('body').on('click', '.comments-div .remove-comments-button', function (evt) {
        evt.preventDefault();
        removeComments($(evt.currentTarget));
    });
    /*
         Triggered when explorer loads a panel
    */
    $('body').on('commentable-content-added', checkForAutoFetchButtons);

    function checkForAutoFetchButtons() {
        var commentFetchButtons = $('.comments-div .fetch-comments-button.auto-fetch');
        if (commentFetchButtons.length) {
            commentFetchButtons.each(function () {
                var fetchButton = $(this);
                fetchButton.removeClass('auto-fetch');
                loadComments(fetchButton);
            });
        }
    }

    /*
        setup EasyMDE onclick
    */
    $('body').on('click', '.comments-div .post-comment-form .comment-text.MDERequired, .conference-form div.MDERequired', function (evt) {
        evt.preventDefault();
        var commentTextDiv = $(evt.currentTarget); // console.log(commentTextDiv);
        var textarea = $(commentTextDiv).find('textarea').first(); // console.log(textarea);
        var textareaId = textarea.attr('id'); // console.log(textareaId);
        newEasyMDE(textareaId);
        commentTextDiv.addClass('MDE');
        commentTextDiv.removeClass('MDERequired');
    });

    function newEasyMDE(elmId) {
        return new EasyMDE({
            element: document.getElementById(elmId),
            forceSync: true, // update this textarea on editor changes
            hideIcons: ['fullscreen', 'side-by-side', '__preview'],
            spellChecker: false,
            nativeSpellcheck: false
        });
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide
    //console.log(' full screen buttons: ' + $('a.toggle-full-screen').length)
    $('body').on('click', 'a.toggle-full-screen', openFullScreen);

    function openFullScreen(e) {
        //console.log('toggle fs');
        e.preventDefault();
        let fullScreenId = $(e.currentTarget).attr('href');
        if (!fullScreenId)
            fullScreenId = '#conference-sweet';

        const elem = document.getElementById(fullScreenId.substring(1));
        if (!document.fullscreenElement) {
            $(elem).css('background', $('body').css('background'));
            $(elem).css('overflow-y', 'auto');
            elem.requestFullscreen();
            $('a.toggle-full-screen .glyphicon-resize-full').removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            $('a.toggle-full-screen .glyphicon-resize-small').addClass('glyphicon-resize-full').removeClass('glyphicon-resize-small');
        }
    }


    /*
         Add comment
    */
    $('body').on('click', '.comments-div .post-comment-form .post-comment-button', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        if (commentDiv.hasClass('posting-comment')) {
            commentDiv.removeClass('posting-comment');
            return;
        }

        commentDiv.addClass('posting-comment');
        if (!commentDiv.length) {
            console.log('Error: Cant find comment div');
        }
        var formDiv = $(evt.currentTarget).closest('.post-comment-form');
        if (!formDiv.length) {
            console.log('Error: Cant find form div');
            return;
        }
        var textInput = formDiv.find('textarea');
        if (!textInput.length) {
            console.log('Error: Cant find text input');
            return;
        }
        var Text = textInput.val();
        if (!textInput[0].checkValidity()) {
            console.log('Error: Text is empty');
            return;
        }
        //console.log(Text);
        var data = getCommentTargetData(commentDiv);
        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        data.action = 'addComment';
        data.Text = Text;
        $.post(serviceUrl, data, function (result) {
            commentDiv.removeClass('posting-comment');
            commentDiv.find('.comments-list').first().html(result);
        });
    });
    /*
         Add thumbs up /down
    */
    $('body').on('click', '.comment .thumbs', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        var comment = $(evt.currentTarget).closest('.comment');
        if (!comment.length) {
            console.log('Error: Cant find comment div');
        }
        var CommentID = comment.attr("data-commentid");
        var Score = ($(evt.currentTarget).hasClass('thumbs-up') ? 1 : 0) +
            ($(evt.currentTarget).hasClass('thumbs-down') ? -1 : 0);
        var data = {'action': 'addThumb', 'TargetID': CommentID, 'TargetType': 'Comment'};

        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        data.Score = Score;
        if (typeof RemoteAuthenticatedDevice !== 'undefined') {
            var NomadAuth = new RemoteAuthenticatedDevice();
            data.NomadAuthToken = NomadAuth.Token;
            data.NomadAuthOrg = NomadAuth.OrganisationID;
        }
        $.post(serviceUrl, data, function (result) {
            if (result.indexOf('glyphicon-thumb') > 0) {
                $(evt.currentTarget).closest('.thumbs-span').html(result);
            } else {
                console.log('Server error during thumb: ' + result);
                $(evt.currentTarget).append(' &nbsp;no thumbing?&nbsp; ');
            }
        });
    });

    $('body').on('click', '.comment .comment-delete-button', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        var comment = $(evt.currentTarget).closest('.comment');
        var deleteButtons = $(evt.currentTarget).closest('.comment-delete')
        comment.addClass('text-muted');
        var CommentID = comment.attr("data-commentid");
        var data = {'action': 'deleteComment', 'TargetID': CommentID, 'TargetType': 'Comment'};

        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        if (typeof RemoteAuthenticatedDevice !== 'undefined') {
            var NomadAuth = new RemoteAuthenticatedDevice();
            data.NomadAuthToken = NomadAuth.Token;
            data.NomadAuthOrg = NomadAuth.OrganisationID;
        }
        nomadRequest(serviceUrl, data, function (result) {
            if (result.indexOf('Error:') > 0) {
                console.log('Server error during delete: ' + result);
                $(evt.currentTarget).append(' &nbsp;not deleted?&nbsp; ');
            } else {
                deleteButtons.html(result);
            }
        });
    });

    $('body').on('click', '.comment .comment-approve-button', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        var comment = $(evt.currentTarget).closest('.comment');
        comment.addClass('text-muted');
        var CommentID = comment.attr("data-commentid");
        var data = {'action': 'approveComment', 'TargetID': CommentID, 'TargetType': 'Comment'};

        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        if (typeof RemoteAuthenticatedDevice !== 'undefined') {
            var NomadAuth = new RemoteAuthenticatedDevice();
            data.NomadAuthToken = NomadAuth.Token;
            data.NomadAuthOrg = NomadAuth.OrganisationID;
        }
        nomadRequest(serviceUrl, data, function (result) {
            if (result.indexOf('Error:') > 0) {
                console.log('Server error during approval: ' + result);
                $(evt.currentTarget).append(' &nbsp;not approved?&nbsp; ');
            } else {
                comment.find('.comment-approve').first().html(result);
                comment.removeClass('status-B')
                comment.removeClass('text-muted');
                comment.addClass('status-A')
            }
        });
    });

    $('body').on('click', '.comment .comment-undelete-button', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        var comment = $(evt.currentTarget).closest('.comment');
        var deleteButtons = $(evt.currentTarget).closest('.comment-delete')
        var CommentID = comment.attr("data-commentid");
        var data = {'action': 'undeleteComment', 'TargetID': CommentID, 'TargetType': 'Comment'};

        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        /* i dont think this is needed here, is repeated .  if (typeof RemoteAuthenticatedDevice !== 'undefined') {
              var NomadAuth = new RemoteAuthenticatedDevice();
              data.NomadAuthToken = NomadAuth.Token;
              data.NomadAuthOrg = NomadAuth.OrganisationID;
          }*/
        nomadRequest(serviceUrl, data, function (result) {
            if (result.indexOf('Error:') > 0) {
                console.log('Server error during undelete: ' + result);
                $(evt.currentTarget).append(' &nbsp;not undeleted?&nbsp; ');
            } else {
                comment.removeClass('text-muted');
                deleteButtons.html(result);
            }
        });
    });

    $('body').on('click', '.comment .comment-edit-button', function (evt) {
        evt.preventDefault();
        var comment = $(evt.currentTarget).closest('.comment');
        if (!comment.length) {
            return;
        }
        var CommentID = comment.attr("data-commentid");
        var useMarkdown = comment.attr("data-useMarkdown");
        var textDiv = comment.find('.comment-text').first();
        var editButton = comment.find('.comment-edit-button').first();
        editButton.fadeOut();
        var deleteButton = comment.find('.comment-delete').first();
        deleteButton.fadeOut();
        var originalTextDiv = textDiv.find('span').first();
        var width = originalTextDiv.width();
        var height = originalTextDiv.height();
        if (useMarkdown === 'true') {
            var originalMarkup = textDiv.find('span').first().html();
            var originalText = textDiv.find('span').first().attr('data-src-text');
            originalText = decodeURIComponent(originalText);  // the src text used to generate the markup
            if (originalMarkup.length == 0) {
                console.log('Error: Cant find original markup');
                return;
            }
            if (originalText.length == 0) {
                console.log('Error: Cant find original text');
                return;
            }
            var textBox = '<textarea id="postCommentTextarea' + CommentID + '" style="_width:' + width + 'px;_height:' + (50 + height * 1.4) + 'px;" ' +
                'class="comment-text-' + CommentID + '" ' +
                'data-original-text="' + encodeURIComponent(originalText) + '" ' +
                'data-original-markup="' + encodeURIComponent(originalMarkup) + '" ' +
                '>' + originalText + '</textarea>' +
                '<button class="comment-edit-submit-button btn btn-success"> Save </button><button class="comment-edit-cancel-button btn btn-warning"> Cancel </button>';
            textDiv.html(textBox);
            textDiv.addClass('MDE');
            newEasyMDE("postCommentTextarea" + CommentID);
        } else {
            var originalHtml = originalTextDiv.find('>span').html();
            var originalText = '';
            originalTextDiv.find('p').each(function () {
                if (originalText)
                    originalText += '\r';
                originalText += $(this).text();
            });
            if (originalText.length == 0) {
                console.log('Error: Cant find original text');
            }
            var textBox = '<textarea style="width:' + width + 'px;height:' + (50 + height * 1.4) + 'px;" class="comment-text-' + CommentID + '">' + originalText + '</textarea>' +
                '<button class="comment-edit-submit-button btn btn-success"> Save </button><button class="comment-edit-cancel-button btn btn-warning"> Cancel </button>';
            textDiv.find('>span').hide();
            textDiv.append(textBox);
        }
    });
    $('body').on('click', '.comment .comment-edit-cancel-button', function (evt) {
        evt.preventDefault();
        var comment = $(evt.currentTarget).closest('.comment');
        var CommentID = comment.attr("data-commentid");
        var useMarkdown = comment.attr("data-useMarkdown");
        var textDiv = comment.find('.comment-text').first();
        var editButton = comment.find('.comment-edit-button').first();
        editButton.fadeIn();
        var deleteButton = comment.find('.comment-delete').first();
        deleteButton.fadeIn();
        if (useMarkdown === 'true') {
            var originalText = textDiv.find('textarea').attr('data-original-text');
            originalText = decodeURIComponent(originalText);
            var originalMarkup = textDiv.find('textarea').attr('data-original-markup');
            originalMarkup = decodeURIComponent(originalMarkup);
            var textBox = '<span data-src-text="' + encodeURIComponent(originalText) + '">' + originalMarkup + '</span>';
            textDiv.html(textBox);
            textDiv.removeClass('MDE');
        } else {
            textDiv.find('>span').show();
            textDiv.find('>textarea,>button,>div.label').remove();
        }
    });
    $('body').on('click', '.comment .comment-edit-submit-button', function (evt) {
        evt.preventDefault();
        var commentDiv = $(evt.currentTarget).closest('.comments-div');
        var comment = $(evt.currentTarget).closest('.comment');
        var CommentID = comment.attr("data-commentid");
        var useMarkdown = comment.attr("data-useMarkdown");
        var Text = comment.find('.comment-text-' + CommentID).val();
        if (!Text || !Text.length) {
            console.log('Error: Text is empty');
            return;
        }
        var data = {'action': 'editComment', 'TargetID': CommentID, 'TargetType': 'Comment', 'Text': Text};

        var serviceUrl = getCommentServiceUrl(commentDiv, data);
        /*
                if (typeof RemoteAuthenticatedDevice !== 'undefined') {
                    var NomadAuth = new RemoteAuthenticatedDevice();
                    data.NomadAuthToken = NomadAuth.Token;
                    data.NomadAuthOrg = NomadAuth.OrganisationID;
                }
        */
        nomadRequest(serviceUrl, data, function (result) {
            if (result.indexOf('Error:') > 0) {
                console.log('Server error during text save: ' + result);
                $(evt.currentTarget).append(' &nbsp;not saved?&nbsp; ');
            } else {
                var editButton = comment.find('.comment-edit-button').first();
                editButton.fadeIn();
                var deleteButton = comment.find('.comment-delete').first();
                deleteButton.fadeIn();
                var textDiv = comment.find('.comment-text').first();
                textDiv.html(result);
                textDiv.removeClass('MDE');
            }
        });
    });

    function getCommentTargetData(commentDiv) {
        var TargetType = commentDiv.attr("data-targettype");
        var TargetID = commentDiv.attr("data-targetid");
        var PanelID = commentDiv.attr("data-panelid");
        var data = {'action': 'getComments', 'TargetID': TargetID, 'TargetType': TargetType};
        if (PanelID)
            data.PanelID = PanelID;
        data = addNomadAuth(data);
        return data;
    }

    function getCommentServiceUrl(commentDiv, data) {
        var PanelID;
        if (typeof data.PanelID != 'undefined')
            PanelID = data.PanelID;
        else if (data.TargetType === 'Panel')
            PanelID = data.TargetID;

        if (typeof PanelID == 'undefined')
            PanelID = commentDiv.closest('[data-panelid]').attr("data-panelid");
        /*
                if (typeof PanelID == 'undefined')
                    PanelID = commentDiv.find('[data-panelid]').first().attr("data-panelid");
        */
        if (!PanelID) console.error('no panel id from comment div ' + commentDiv.html());

        var serviceUrl = getConferenceUrl(commentDiv) + '/page/none/p/' + PanelID + '/comment-service';

        return serviceUrl;
    }

    function updateStarsInExplorerData(starUpdateData) {
        $.each(NomadITpanels, function () {
            var panelHasStarredPaper = false;
            if (this.PanelID == starUpdateData.PanelID) {
                //console.log('updating star data for ' + this.PanelID);
                if (typeof starUpdateData.PaperID === 'undefined') {
                    this.IsStarred = (starUpdateData.action === 'add');
                    if (this.IsStarred) {
                        $('.star-' + starUpdateData.PanelID).removeClass('glyphicon-star-empty');
                        $('.star-' + starUpdateData.PanelID).addClass('glyphicon-star');
                    } else {
                        $('.star-' + starUpdateData.PanelID).removeClass('glyphicon-star');
                        $('.star-' + starUpdateData.PanelID).addClass('glyphicon-star-empty');
                    }
                } else {
                    if (typeof this.Papers !== undefined) {
                        $.each(this.Papers, function () {
                            if (this.PaperID == starUpdateData.PaperID) {
                                this.IsStarredPaper = (starUpdateData.action === 'add');
                            }
                            panelHasStarredPaper = panelHasStarredPaper || this.IsStarredPaper;
                        });
                        this.HasPaperStarred = panelHasStarredPaper;
                        if (panelHasStarredPaper)
                            $('.star-' + starUpdateData.PanelID).addClass('paper-starred')
                        else
                            $('.star-' + starUpdateData.PanelID).removeClass('paper-starred')

                    }
                }
            }
        });

        if (starUpdateData.action === 'add')
            $('body').trigger('panel-star-added');
        else
            $('body').trigger('panel-star-removed');

    }

    function doStarAction(starEle, data) {
        var serviceUrl = getConferenceUrl(starEle) + '/page/none/star-service';
        data.action = starEle.hasClass('glyphicon-star') ? 'remove' : 'add';
        if ($('body.view-starred').length || $('#days-container.has-stars').length) {
            if (typeof data.PaperID == 'undefined' && typeof data.TimeTableRowID == 'undefined') {
                starEle = $('.star-' + data.PanelID) // There might be more than one panel, like the timetable page
            } else if (typeof data.TimeTableRowID !== 'undefined') {
                starEle = $('.tt-star-' + data.TimeTableRowID) // There might be more than one rendereing of the event
            } else if (typeof data.PaperID != 'undefined') {
                starEle = $('.paper-star[data-paperid='+data.PaperID+']')
            }
        }
        starEle.addClass('pending');
        nomadRequest(serviceUrl, data, function ($result) {
            starEle.removeClass('pending');

            if (data.action === 'add') {
                starEle.removeClass('glyphicon-star-empty');
                starEle.addClass('glyphicon-star');
                starEle.find('.sr-only').text('star added')
            } else if (data.action === 'remove') {
                starEle.removeClass('glyphicon-star');
                starEle.addClass('glyphicon-star-empty');
                starEle.find('.sr-only').text('star removed')
            }
            //update the panel explorer data (if the page is a panel explorer)
            if (typeof data.PanelID !== 'undefined' && typeof NomadITpanels !== 'undefined') {
                updateStarsInExplorerData(data);
            } else if ($('body.view-panel').length && typeof data.PaperID !== 'undefined') {
                if ($('.paper-star.glyphicon-star').length) {
                    $('.panel-star').addClass('paper-starred');
                } else {
                    $('.panel-star').removeClass('paper-starred');
                }
            }
        });
    }

    function getConferenceUrl(ele) {
        if (window.messengerServiceUrl !== undefined)
            return window.messengerServiceUrl;

        var confUrl;
        var confSlug = null;
        if (window.ConferenceSlug !== undefined) confSlug = ConferenceSlug;//check the global scope for a ConferenceSlug , set by explorer and conference.js
        if (!confSlug) confSlug = ele.closest('[data-conf]').attr('data-conf');//on the none explorer pages get the slug which is on each panel container
        if (!confSlug) confSlug = ele.closest('[data-conference]').attr('data-conference');//on the none explorer pages get the slug which is on each panel container
        if (!confSlug) confSlug = $('[data-conference]').first().attr('data-conference');//on the none explorer pages get the slug which is on each panel container
        if (!confSlug)
            return;
        confUrl = '/conference/' + confSlug;
        if (typeof NomadITConferenceSite !== 'undefined')
            confUrl = NomadITConferenceSite + confUrl.substring(11);

        return confUrl;

    }

    window.setTimeout(function () {
        if ($('.autoload-comments').length || '#comments' == window.location.hash)
            checkForAutoFetchButtons()
    }, 100);

    $('.conference-news').each(function () {
        var newsDiv = $(this);
        if (newsDiv.hasClass('news-activated'))
            return; //only apply to a Div once
        newsDiv.addClass('news-activated')
        var updateInterval;
        var lastUpdateAt = 0;
        var newsUrl = newsDiv.attr('data-news-service-url');
        if (!newsUrl) {
            console.log('Error: conference-news has no data-news-service-url attribute');
            return;
        }
        var refreshAfter = newsDiv.attr('data-news-refresh-after');
        if (!refreshAfter) {
            refreshAfter = 0;
        }
        //console.log('conference-news will refresh in '+refreshAfter+' seconds from '+newsUrl);
        window.setTimeout(updateNews, 25 + refreshAfter * 1000);

        function updateNews() {
            var data = {t: lastUpdateAt};
            nomadRequest(newsUrl, data, handleNewsResponse);
        }

        function handleNewsResponse(newsData) {
            if (typeof newsData.content != 'undefined') {
                newsDiv.html(newsData.content);
            }
            if (typeof newsData.updateInterval != 'undefined') {
                lastUpdateAt = newsData.t;
                updateInterval = Math.max(30, Number(newsData.updateInterval));
                window.setTimeout(updateNews, updateInterval * 1000);
            }
        }
    });

    var loggedIn = false;

    function addNomadAuth(data) {
        if (typeof RemoteAuthenticatedDevice !== 'undefined') {
            var NomadAuth = new RemoteAuthenticatedDevice();
            if (typeof NomadAuth == 'undefined' || !NomadAuth.ValidOn || !NomadAuth.Token) {
                loggedIn = false;
                //console.log(' no t logged in '+NomadAuth.ValidOn+' '+NomadAuth.Token)
            } else {
                loggedIn = true;
                data.NomadAuthToken = NomadAuth.Token;
                data.NomadAuthOrg = NomadAuth.OrganisationID;
                //console.log('logged in '+NomadAuth.ValidOn+' '+NomadAuth.Token+' '+NomadAuth.OrganisationID)
            }
        }
        //console.log('rad type ='+typeof(RemoteAuthenticatedDevice));
        //console.log('data'+JSON.stringify(data));
        return data;
    }

    /**
     * A drop in replacement for jQuery.post(...),
     * Remote Authentication credentials will be added to posted data if available.
     * one event is triggered if a RemoteAuthentication request appears to return none-logged in data
     *  (ie. Remote Session terminated by server, or has expired, or user has clicked 'log out' in another tab/window...
     * @param url
     * @param data data to post, or empty object
     * @param handler function to call with the response
     * @param failureHandler function to call with an error
     */
    function nomadRequest(url, data, handler, failureHandler, waitIfNotReady) {
        if (!waitIfNotReady)
            waitIfNotReady = 100;
        if (typeof window.NomadAuth !== 'undefined' && !window.NomadAuth.isReady) {
            if (waitIfNotReady > 0) {
                window.setTimeout(function () {
                    nomadRequest(url, data, handler, failureHandler, waitIfNotReady - 3);
                    console.log('request pausing until remote auth ready');
                }, 800);
            }
            return;
        }
        if (!(typeof failureHandler === 'function')) {
            failureHandler = function (xhr) {
                handler('Request failed: ' + xhr.status + '. Status text: ' + xhr.statusText);
            }
        }

        data = addNomadAuth(data);
        //console.log((loggedIn ? '' : 'un') + 'authorized request ' + url)
        $.post(url, data,
            function (scope) { //scope might be data or html
                if (typeof scope.t !== 'undefined') {
                    //check if scope.me is set - confirm person is logged in
                    // if the response is data then check whether logged in by the presence of 'me' object
                    if (typeof scope.me !== 'undefined') {
                        loggedIn = true;
                    } else {
                        // not logged in, no me in scope
                        if (loggedIn && typeof RemoteAuthenticatedDevice !== 'undefined') {
                            // If using remote auth and no longer logged in, then trigger this event:
                            // logged in menu item will be updated by NomadAuth.php
                            // (also maybe the page will refresh)
                            console.log('Error: not authorized in all.js');
                            $('body').trigger('remote-auth-failed');
                        }
                        loggedIn = false;
                    }
                }
                /* forward to the handler, scope might be data or html */
                handler(scope);
            }).fail(failureHandler);
    }

    /** When option with class ".other-option" is not selected, the elements selected by
     * a selector defined in the required html attribute "data-other-value-toggles" are hidden.
     */
    $('[data-other-value-toggles]').each(function () {
        checkOtherVisibility($(this));
    });

    /** When option with class ".other-option" is selected, the visibility of elements selected by
     * a selector defined in the required html attribute "data-other-value-toggles"=".the-other-text-input"*/
    $('[data-other-value-toggles]').on('change', function (evt) {
        var ele = $(evt.currentTarget);
        checkOtherVisibility(ele)
    });

    function checkOtherVisibility(ele) {
        var id = ele.attr('id');
        var otherSelector = ele.attr('data-other-value-toggles');
        if ($('#' + id + ' option.other-option:checked').length) {
            $(otherSelector).fadeIn();
        } else {
            $(otherSelector).fadeOut(function () {
                $(otherSelector).val('');
            });
        }
    }

    $('body').on('click', '.close-button', function (evt) {
        window.open('', '_self', '');
        window.close();
    });
    $('body').on('click', '.back-button', function () {
        history.back();
    });
    var playerUrlTemplate = NomadITConferenceSite + '/player.php?url=';
    $('body').on('click', '.toggle-iframe-button', function (evt) {
        var ele = $(evt.currentTarget);
        var iframeSource = ele.attr('data-iframe-source');
        if (iframeSource.endsWith('.mp4'))
            iframeSource = playerUrlTemplate + encodeURI(iframeSource);
        var iframeSelector = '#' + ele.attr('data-iframe-id');
        var dropdownSelector = '#' + ele.attr('data-dropdown-id');
        var closedIframeSource = 'https://nomadit.co.uk/empty.html';// ele.attr('data-closed-iframe-source');
        var streamIframe = $(iframeSelector);
        var streamBox = $(dropdownSelector);
        if (streamBox.hasClass('loaded')) {
            streamBox.removeClass('loaded');
            ele.attr('aria-expanded', false)
            if (closedIframeSource) streamIframe.attr('src', closedIframeSource);
        } else {
            streamBox.addClass('loaded');
            ele.attr('aria-expanded', true)
            streamIframe.attr('src', iframeSource);
        }
        return false;

    })

    initialiseWhenReady()

    function initialiseWhenReady() {
        window.setTimeout(loadPublicContent, 1);
        if (typeof window.NomadAuth !== 'undefined' && !NomadAuth.isReady) {
            window.setTimeout(initialiseWhenReady, 200);
            console.log('auth not ready');
            return;
        }
        window.setTimeout(loadRemoteContent, 2);
    }

    function loadPublicContent() {
        /* same as load-remote-content but skips remote auth
        */
        //console.log('finding remote content ')
        $('.load-public-content:visible').each(function () {
            console.log('found visible load-public-content element ')
            var element = $(this);
            element.removeClass('load-public-content');
            var url = element.attr('data-remote-content-url');
            //console.log('found visible load-remote-content element url=' + url);
            var errorMessage = element.attr('data-remote-content-error');
            if (url) {
                element.addClass('remote-content-loading');
                $.ajax({
                    url: url,
                    success: function (data) {
                        element.removeClass('remote-content-loading').addClass('remote-content-loaded');
                        if (data.indexOf('<html')!==-1 || data.indexOf('<body')!==-1)
                            data= '[unexpected fetched content removed ]';
                        element.html(data);
                        $('body').trigger('commentable-content-added');
                    },
                    fail: function (xhr) {
                        element.removeClass('remote-content-loading').addClass('remote-content-failed');
                        //console.log('Request Status: ' + xhr.status + ' ' + xhr.statusText);
                        if (errorMessage)
                            element.html(forbiddenMessage+ ' '+xhr.status);
                        else
                            element.html('Request Status: ' + xhr.status + '. Status Text: ' + xhr.statusText);
                    }
                }
                );
            }
        });
    }
    function loadRemoteContent() {
        /* eg https://easaonline.tst/conferences/easa2022/films/a-colombian-family has code in film-template.html:
             <span class="load-remote-content"
                   data-remote-content-url="https://tst.nomadit.co.uk/delegate-files/easa2022/film-links/{{Slug}}.html"
                   data-remote-content-forbidden=" [you are not permitted to see delegate-only content]">
                 fetching delegate only link ...
            </span>
        */
        //console.log('finding remote content ')
        $('.load-remote-content:visible').each(function () {
            //console.log('found visible load-remote-content element ')
            var element = $(this);
            element.removeClass('load-remote-content');
            var url = element.attr('data-remote-content-url');
            //console.log('found visible load-remote-content element url=' + url);
            var forbiddenMessage = element.attr('data-remote-content-forbidden');
            if (url) {
                element.addClass('remote-content-loading');
                nomadRequest(url, {},
                    function (data) {
                        element.removeClass('remote-content-loading').addClass('remote-content-loaded');
                        if (data.indexOf('<html')!==-1 || data.indexOf('<body')!==-1)
                            data= '[unexpected fetched content removed]';
                        element.html(data);
                    },
                    function (xhr) {
                        element.removeClass('remote-content-loading').addClass('remote-content-failed');
                        //console.log('Request Status: ' + xhr.status + ' ' + xhr.statusText);
                        if (forbiddenMessage && xhr.status == 403)
                            element.html(forbiddenMessage); //might be "Paid up delegates only/member only"
                        else
                            element.html('Request Status: ' + xhr.status + '. Status Text: ' + xhr.statusText);
                    },
                    800, true, true);
            }
        });
    }
});
/**
 * Moved from page/participant-table.js
 * Now elsewhere eg. https://nomadit.co.uk/conference/dsa2020/edit-timetable/show/list
 */
window.addEventListener('DOMContentLoaded', function () {
    var $ = window.jQuery;

    function downloadEncodedCsv(encoded_csv, data_name) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encoded_csv;
        hiddenElement.target = '_blank';
        hiddenElement.download = data_name + '.csv';
        //console.log(encoded_csv.length+' bytes added to download anchor to simulate a click.')
        hiddenElement.click();
    }


    function csvDownloadClicked(event) {
        //console.log('handling csv download in all.js');
        let button = $(event.currentTarget);
        var table = button.parent().find('table').first();
        if (!table.length)
            table = button.parent().parent().find('table').first();
        if (!table.length) {
            alert('ERRor csv button "'+button.text()+'" could not find a table to export');
        }

        var dataName = button.attr('data-download-name');
        if (!dataName) {
            dataName = $('.h2').first().text().trim();
        }
        if (!dataName) {
            dataName = 'table-data';
        }
        var searchText = button.parent().find('.dataTables_filter input').first();
        if (searchText.length) {
            searchText = searchText.val();
            dataName =dataName + '_' + searchText.trim();
        } else {
            searchText = button.parent().find('.h4').first();
            if (searchText.length) {
                searchText = searchText.text();
                dataName = dataName + '_' + searchText.trim();
            }
        }
        dataName = dataName.replace(/([\n\r\ ]+)/g, "-").replace(/([^a-zA-Z0-9_\-])/g, "");
        var exportRawHtml = !!button.attr('data-export-raw-html');
        //console.log(table.length+ ' table found.');
        //console.log('Exporting as ' + dataName + '.csv ' + (exportRawHtml ? ' from the raw html ' : ' from table text'));

        var csv = '';
        var cell;
        var iColumnCount = 0;
        var iRowCount = 0;
        table.find('tr').each(function () {
            var row = $(this), iColumnCheckCount, line;
            if (iRowCount === 0) {
                row.find('th').each(function () {
                    iColumnCount += 1;
                    var cell = $(this).text();
                    var columnHeading = cell.replace(/[\n\r\t\ ]+/g, " ").trim().replace(/(^\()|(\)$)/g, "").replace('"', '\"');
                    if (columnHeading.length === 0) {
                        columnHeading = "Column " + iColumnCount;
                    }
                    csv += encodeURIComponent(((csv.length === 0) ? '' : ',') + '"' + columnHeading + '"');
                });
                csv += encodeURIComponent("\n");

            } else {
                line = '';
                iColumnCheckCount = 0;
                row.find('td').each(function () {
                    iColumnCheckCount += 1;
                    if (exportRawHtml) {
                        cell = $(this).html();
                        cell = cell.trim().replace(/[\t\ ]+/g, ' ').replace(/[\n\r]+/g, '\n').replace(/"/g, '""');
                    } else {
                        cell = $(this).text();
                        cell = cell.replace(/[\n\r\t\ ]+/g, ' ').trim().replace(/(^\()|(\)$)/g, "").replace(/"/g, '""');
                    }
                    line += encodeURIComponent(((line.length === 0) ? '' : ',') + '"' + cell + '"');
                });
                if (iColumnCheckCount !== iColumnCount) {
                    window.alert('data read failed , a line had ' + iColumnCheckCount + ' columns, should have ' + iColumnCount)
                    return;
                }
                csv += line + encodeURIComponent("\n");
            }
            iRowCount += 1;
        });
        downloadEncodedCsv(csv, dataName);
    }


    $('.download-csv:not(.handler-added)').on('click', csvDownloadClicked).addClass('handler-added');
});

jQuery(document).ready(function ($) {

    let eventLifecycleTimeoutId = 0;
    let eventLifecycleTimeoutTime = 0;
    //console.log('time zone init ');
    //this adds event-started and event-over classes to div.mark-event-lifecycle based on first and second <time> elements being start and end
    //if a transition is due soon, then a check again timeout is scheduled.
    initialiseBrowserDeltaTime();
    initialiseEventLifecycleWatchers();
    $('body').on('commentable-content-added', initialiseEventLifecycleWatchers);

    function initialiseBrowserDeltaTime() {

        let datetimeAccordingToServerElement = $('body[data-time-now]');
        if (datetimeAccordingToServerElement.length) {
            let now = new Date().valueOf();
            let nowAccordingToServer = 1000 * Number.parseInt(datetimeAccordingToServerElement.attr('data-time-now'));
            NomadITBrowserDeltaTime = nowAccordingToServer - now;
        } else {
            NomadITBrowserDeltaTime = 0;
        }
    }

    function getTimeNow() {
        let now = new Date().valueOf();
        if ('number' === typeof NomadITBrowserDeltaTime)
            now += NomadITBrowserDeltaTime;
        return now;
    }
    function initialiseEventLifecycleWatchers() {
        let Tnext = 0;
        let now = getTimeNow();
        var startUTC;
        var endUTC;
        $('.mark-event-lifecycle:not(.event-over)').each(function () {
            let eventDiv = $(this);
            let times = eventDiv.find('time')
            if (times.length >= 2) {
                startUTC = $(times[0]).attr('datetime');
                endUTC = $(times[1]).attr('datetime');
            } else {
                startUTC = eventDiv.attr('data-start-time');
                endUTC = eventDiv.attr('data-end-time');
            }
            if (!startUTC || !endUTC)
                return;
            //console.log('s = ' + startUTC + ' e = ' + endUTC);
            let Tstart = new Date(startUTC).valueOf();
            let Tend = new Date(endUTC).valueOf();
            if (Tstart > Tend) {
                //console.log('starts after end, Ts = ' + Tstart + ' Te = ' + Tend + ' now = ' + now);
                return;
            }
            if (Tstart > now && (Tnext === 0 || Tnext > Tstart)) {
                Tnext = Tstart;
            } else if (Tend > now && (Tnext === 0 || Tnext > Tend)) {
                Tnext = Tend;
            }
            if (Tstart < now) {
                //console.log('already started, Ts = ' + Tstart + ' Te = ' + Tend + ' now = ' + now);
                eventDiv.addClass('event-started')
                if (Tend < now) {
                    //console.log('and already over.');
                    if (eventDiv.hasClass('delete-when-over'))
                        eventDiv.remove();
                    else
                        eventDiv.addClass('event-over');
                }
            } else {
                //console.log('In future Ts = ' + Tstart + ' Te = ' + Tend + ' now = ' + now);
            }
        });
        let checkAgainPeriod = Tnext - now + 1;

        if (checkAgainPeriod < 0) {
            //console.log('no future event times found');
        } else if (checkAgainPeriod > 0 && checkAgainPeriod <= 3 * 24 * 60 * 60 * 1000) {
            //console.log('check times again in ' + (checkAgainPeriod / 1000 / 60) + ' minutes');
            if (eventLifecycleTimeoutId) {
                if (eventLifecycleTimeoutTime <= Tnext) return;
                clearTimeout(eventLifecycleTimeoutId);
            }
            eventLifecycleTimeoutTime = Tnext;
            eventLifecycleTimeoutId = window.setTimeout(initialiseEventLifecycleWatchers, checkAgainPeriod);
        } else if (checkAgainPeriod > 3 * 24 * 60 * 60 * 1000) {
            //console.log('Not monitoring lifecycle events, next event in ' + (checkAgainPeriod / 1000 / 60 / 60 / 24) + ' days');
        }
    }

    addTimeZoneOption();

    function addTimeZoneOption() {
        if ($('.use-timezone-switch ').length === 0) {
            return;
        }
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let days_abbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let dateFormat = Intl.DateTimeFormat().resolvedOptions();
        let timeZone = dateFormat.timeZone;
        let times = null;
        $('body').on('click', 'button.LocalTimeZoneButton', toLocalTimes);
        $('body').on('click', 'button.RevertTimeZoneButton', revertToOriginalTimes);

        let timeZonePreference = 'Conference';
        $('body').on('commentable-content-added', initialiseTimeZone);

        initialiseTimeZone();
        console.log('Adding time zone button listeners');

        function initialiseTimeZone() {
            timeZoneText = $('.use-timezone-switch .TimeZoneText');
            if (timeZoneText.length > 0 && timeZoneText.first().text() == timeZone) {
                console.log('timeZone same as browser');
                $('.use-timezone-switch').removeClass('use-timezone-switch')
                return;
            }
            console.log('timeZone is ' + timeZone + ' conf zone is '+timeZoneText.first().text());

            times = $('time[datetime],span.zoned-datetime[datetime]');
            if (window.localStorage && window.localStorage.getItem('TimeZone')) {
                timeZonePreference = window.localStorage.getItem('TimeZone');
            }
            console.log('initialising ' + times.length + ' times ' + timeZonePreference);

            var futureTimeExists = false;
            times.each(function () {
                let ele = $(this);
                let T = new Date(ele.attr('datetime')).valueOf();
                let now = getTimeNow();

                if (!ele.attr('data-original-content'))
                    ele.attr('data-original-content', ele.text());
                console.log('T:' + T + ' now:' + now);
                if (T > now - 1000 * 60 * 60 * 24) {
                    futureTimeExists = true;
                }
            });
            if (!futureTimeExists) {
                console.log('No times after yesterday - no timezone switch');
                return;
            }

            timeZoneText.each(function () {
                let ele = $(this);
                if (ele.text() === timeZone){
                    console.log('TimeZone is same as browser - no time zone selector');
                    return;
                }
                if (!ele.attr('data-original-content'))
                    ele.attr('data-original-content', ele.text());
                if (timeZonePreference !== 'Local')
                    ele.html(ele.attr('data-original-content') +
                        ' <button style="background:rgba(255,0,0,0.07)" title="use your time zone: ' + timeZone + '" class="btn btn-light LocalTimeZoneButton">' +
                        'change' +
                        '</button>');
            });
            if (timeZonePreference === 'Local')
                toLocalTimes();
        }


        function toLocalTimes() {
            $('body').addClass('to-local-times');
            let isConferencePage = $('#conference-sweet').length;
            times.each(function () {
                let ele = $(this);
                let utcDate = ele.attr('datetime');
                if(!utcDate) utcDate = ele.attr('data-datetime');
                let dateFormat = ele.attr('data-date-format');
                if (!dateFormat)
                    dateFormat = 'G:i';
                let localDateString = new Date(utcDate).toLocaleString("en-US", {
                    localeMatcher: "best fit",
                    timeZoneName: "short"
                });
                let localDate = new Date(localDateString);
                console.log('converting '+dateFormat+' time= '+localDate);
                let localTime = datePhpFormat(dateFormat, localDate);
                console.log('to '+localTime);
                ele.html(localTime);
                ele.css('background', 'rgba(255,0,0,0.1)');
                window.setTimeout(function() {
                    ele.css('background', 'none');
                },1000);
            });
            timeZoneText.each(function () {
                let ele = $(this);
                let initial = ele.attr('data-original-content');
                if (!initial) {
                    initial = ele.text();
                    ele.attr('data-original-content', initial);
                }
                ele.html(
                    '<span style="border-bottom:0.2em solid rgba(255,0,0,0.3);padding:0.2em">'
                    + timeZone +
                    '</span>' +
                    ' <button style="background: rgba(0,255,0,0.07)"' +
                    ' title="use the event time zone: ' + initial + '"' +
                    ' class="btn btn-default RevertTimeZoneButton">' +
                    ' <span class="glyphicon glyphicon-transfer"></span> ' +
                    'change' +
                    ' </button>'+
                    '<br>'+
                    (isConferencePage?'<em>may be different from the conference time zone</em>':'')
                );
            });
            if (window.localStorage)
                window.localStorage.setItem('TimeZone', 'Local')
        }

/*        nearly complete implementation of php date(Format, Time)*/
         function datePhpFormat(dateFormat,localDate) {

            let converter = function(s) {
                if (s === 'l') return days[localDate.getDay()]                       ;
                if (s === 'D') return days_abbr[localDate.getDay()]                  ;
                if (s === 'j') return localDate.getDate()                            ;
                if (s === 'F') return months[localDate.getMonth()]                   ;
                if (s === 'm') return ('00' + (1 + localDate.getMonth())).slice(-2)  ;
                if (s === 'n') return (1 + localDate.getMonth())                     ;
                if (s === 'Y') return localDate.getFullYear()                        ;
                if (s === 'G') return localDate.getHours()                           ;
                if (s === 'H') return ('00' + localDate.getHours()).slice(-2)        ;
                if (s === 'i') return ('00' + localDate.getMinutes()).slice(-2)      ;
                if (s === 's') return ('00' + localDate.getSeconds()).slice(-2)      ;
                return s;
            };
            let localTime = '';
            let escaped = false;
            for (let i = 0; i < dateFormat.length; i++) {
                if (!escaped) {
                    if (dateFormat[i]==='\\')
                        escaped = true;
                    else
                        localTime += converter(dateFormat[i]);
                } else {
                    localTime += dateFormat[i];
                    escaped = false;
                }
            }
            return localTime;

        }
        function revertToOriginalTimes() {
            timeZoneText = $('.TimeZoneText');
            times = $('time[datetime],span.zoned-datetime[datetime]');
            $('body').addClass('original-times');
            times.each(function () {
                let ele = $(this);
                let content = ele.attr('data-original-content');
                if (!content) {
                    ele.attr('data-original-content', ele.text());
                } else {
                    ele.html(content);
                }
                ele.css('background', 'rgba(0,255,0,0.07)');
                window.setTimeout(function() {
                    ele.css('background', 'none');
                },1000);
            });
            timeZoneText.each(function () {
                let ele = $(this);
                ele.html(
                    '<span style="border-bottom:0.2em solid rgba(0,255,0,0.3);padding:0.2em">' +
                    ele.attr('data-original-content') +
                    '</span>' +
                    ' <button style="background:rgba(255,0,0,0.07)" title="use your time zone: ' + timeZone + '"' +
                    ' class="btn btn-default LocalTimeZoneButton">' +
                    ' <span class="glyphicon glyphicon-transfer"></span> ' +
                    'change' +
                    ' </button>'
                );
            });
            if (window.localStorage)
                window.localStorage.setItem('TimeZone', 'Conference')
        }
    }
});
