/* 
** Plugin smoothScroll
** scroll bar design pour votre site web
** Developpée par Adam Santoro
** http://asfastbar.adamsantoro.fr
*/

(function($) {

    'use strict';

    // Début de la fonction smoothScroll

    $.fn.smoothScroll = function(arg) {

        // Reception des paramêtre, fusion avec les paramêtres internes

        var settings = $.extend({

            // Theme dark : scrollbar sombre. Light, scrollbar claire

            theme: 'dark',

            // Si true, la barre se masque automatiquement quand non utilisée

            autoHide: false,

            // Régler l'opacité de la barre

            opacity:2,

            // Si le background dois être affiché ou non

            background: false,

            // Vitesse de scroll: 1 = lent, 2 = normal, 3 = rapide

            scrollSpeed: 3,

            // Delais avant que la barre ne se masque si autoHide = true

            delayHideBar: 1000,

            // Possibilité d'ajouter son propre css sur la barre ou le fond

            cssBar: true,

            // Afficher ou non le background de la barre

            cssBg: true,

            // Choisir d'animer ou non la barre

            animate: true,

            // Paramètre qui determine si un click sur la bar est maintenu

            barHold: false,

            // Paramètre qui determine si le curseur est dans la scrollbar

            barIn: false,

            // Paramêtre qui garde la position Y de la souris a l'instant T du click sur la bar

            msPageY: 0,

            // Lors d'un drag and drop de la bar, stocke la différence entre le haut de la barre et la pos Y de la souris

            barDiff: 0,

            // Contient la cible d'event  lors d'un click sur la bar, a savoir #asBarBody

            target: 0,

            // Paramêtre qui limite le nombre d'execution par seconde de la fontion de déplacement de la barre a la souris

            scrollDelayTime: false,

            // contient document.body si chrome, document.documentElement sinon

            scrollElement: null,

            // Distance en pixel de #asBar par rapport au haut de l'écran

            barTop: function() {
                return parseInt($('#asBar').css('top'));
            },

            // Distance en pixel de #asBarBody par rapport au haut de l'écran

            barBodyTop: function() {
                return parseInt($('#asBarBody').css('top'));
            },

            // Taille Y en pixel de #asBar 

            barHeight: function() {
                return $('#asBar').innerHeight();
            },

            // Taille Y en pixel de #asBarBody

            barBodyHeight: function() {
                return $('#asBarBody').innerHeight();
            },

            // Taille du scroll top, si la page est scrollée

            heightScroll: function() {

                return $(document).scrollTop();

            },

            // Hauteur de la page visible

            docHeight: document.documentElement.clientHeight,

            // Hauteur totale de la page

            docTotalHeight: $(document).innerHeight(),

            // Si la bar est actuellement visible

            statutBar: true,

            // Retourne le timer courant

            date: function() {
                return (new Date()).getTime();
            },

            // Nombre de seconde écoulé depuis le dernier scroll de la souris

            lastScroll: null,

            // stocke le setTimout du hide auto du wheel

            timerWheel: false,

            // stocke le setTimout du resize

            timerResize: false,

            // Stocke le temps du dernier resize

            lastResize: 0,

            // Vaut true si le scroll event est déclenché par le drag de la bar, auquel cas le repositionnement est annulé

            scrollEvent: false,

            // Rafraichis les données de hauteur de la page

            refresh: function() {

                // Hauteur de la page

                settings.docHeight = document.documentElement.clientHeight;

                // Hauteur totale de la page

                settings.docTotalHeight = $(document).innerHeight();

            }

        }, arg);

        // Si l'utilisateur à déclaré une vitesse supérieure à 3, elle vaux 3  

        settings.scrollSpeed = settings.scrollSpeed > 3 ? 3 : settings.scrollSpeed;

        // Contient les méthodes du plug in

        var method = {

            // Méthode d'initialisation, appelée au chargement du plugin

            init: function() {

                // Si le plugin n'a pas deja été appelé

                if (!document.getElementById('asBar')) {

                    $('html').css('overflow', 'hidden');

                    // Detection du scrollTop selon browser

                    settings.scrollElement = document.body > 0 ? document.body : document.documentElement;

                    // Si la barre dois être masquée avec autoHide: true

                    settings.statutBar = settings.autoHide ? false : true;

                    // Construction de asBar

                    $('body').append($(document.createElement('div')).attr({
                        id: 'asBar'
                    }));

                    // Construction de asBarBody

                    $('#asBar').append($(document.createElement('div')).attr({
                        id: 'asBarBody'
                    }));

                    // Calcul de la hauteur des bars

                    method.setBarSize();

                    // Application du css de base pour les éléments

                    var c = settings.theme == 'dark' ? '#000' : '#fff',
                        bg = 'transparent',
                        bgOp = 0;

                    if (settings.background) {

                        bg = settings.theme == 'dark' ? '#fff' : '#000';

                        bgOp = settings.opacity;

                    }

                    $("#asBar").css({
                        background: bg,
                        opacity: bgOp
                    });

                    $("#asBarBody").css({
                        background: c
                    });

                    $("#asBar, #asBarBody").css({
                        position: 'fixed',
                        right: '2px',
                        top: '7px',
                        width: '8px'
                    });

                    if (settings.cssBg) $("#asBar").css(settings.cssBg);

                    if (settings.cssBar) $("#asBarBody").css(settings.cssBar);

                    // Si hideAuto, mettre la barre a 0

                    !settings.statutBar ? $('#asBar, #asBarBody').css('opacity', 0) : $('#asBar, #asBarBody').css('opacity', 0);

                    method.checker();

                }

            },

            setBarSize: function() {

                settings.timerResize = setTimeout(function() {

                    // Et qu'il n'y a pas eu de resize depuis le delai de re calcul

                    if ((settings.date() / 1000).toFixed(1) - (settings.lastResize / 1000).toFixed(1) >= 0.5) {

                        settings.refresh();

                        $('#asBar').css('height', (settings.docHeight - 14) + "px");

                        $('#asBarBody').css('height', ((settings.docHeight - 14) / (settings.docTotalHeight / settings.docHeight)) + "px");

                        method.setBPos();

                    }

                }, 500);

            },

            setBPos: function() {

                // Si le scroll n'est pas déclenché par le drag de la bar

                if (!settings.scrollEvent) {

                    // Calcul de la nouvelle position de la scrollbar

                    var y = (settings.heightScroll() / (settings.docTotalHeight / settings.docHeight)),
                        max = settings.barTop();

                    // Si la position ne sors pas du haut de asBar 

                    y = y < max ? max : y;

                    // Déplacement de la bar

                    settings.animate ? $('#asBarBody').animate({
                        top: y + 'px'
                    }, {
                        duration: 20
                    }) : $('#asBarBody').css({
                        top: y + 'px'
                    });

                } else settings.scrollEvent = false;

                settings.timerResize = false;

            },

            // Fonction qui masque la bar au bou du délais définis dans les paramêtres 

            hideBar: function() {

                settings.timerWheel = setTimeout(function() {

                    // Si le curseur n'est pas dans la bar

                    if (!settings.barIn) {

                        // Et qu'il n'y a pas eu de scroll depuis le delai de masquage de la barre

                        if (Math.round(settings.date() / 1000) - settings.lastScroll >= settings.delayHideBar / 1000) {

                            // on la cache

                            settings.statutBar = false;

                            $('#asBar, #asBarBody').animate({
                                opacity: 0
                            }, 'slow');

                        }

                    }

                    // settings.delayHideBar = le delai au bout duquel on masque la barre 

                }, settings.delayHideBar);

            },

            // Fonction qui affiche la bar quand appelée si elle n'est pas déjà visible

            showBar: function() {

                if (!settings.statutBar) {

                    settings.statutBar = true;

                    $('#asBar, #asBarBody').animate({
                        opacity: settings.opacity
                    }, 'fast');

                }

            },

            checker: function() {

                setInterval(function() {

                    if (!settings.timerResize) method.setBarSize();

                }, 1000);

            }

        }

        // Fonction principale, qui renvois l'élément qui appelle le plugin, pour garder le chainage 

        return this.each(function() {

            // Stockage du contexte dans une variable

            var that = $(this);

            // Initialisation, selon le contexte

            method.init.call(window);

            // Event du scroll de la souris, selon browser

            var wheel = 'DOMMouseScroll' in window ? 'DOMMouseScroll' : 'mousewheel';

            // Surveillance de l'event de scroll de la souris

            $(this).scroll(function() {
                if (!settings.barHold) method.setBPos();
            });

            // Redimensionnement des bars lors du resize

            $(window).resize(function() {

                settings.lastResize = settings.date();

                if (settings.timerResize) {
                    clearTimeout(settings.timerResize);
                    settings.timerResize = false;
                }

                method.setBarSize();

            });

            $(this).bind(wheel + ' keydown', function(event) {

                // Construction des variables nécéssaires

                var hScroll = settings.heightScroll();

                var sizeScroll = 25 * settings.scrollSpeed;

                // Delta sert a déterminer la direction du scroll

                var delta = event.originalEvent.detail ? -event.originalEvent.detail : event.originalEvent.wheelDelta;

                // Scroll vers le haut

                if (delta >= 0 || (!delta && event.keyCode == 38)) {

                    if (hScroll > 0 && hScroll < sizeScroll) scrollTo(0, 0);

                    else if (hScroll > 0) scrollBy(0, -sizeScroll);

                }

                // Scroll vers le bas
                else if (delta < 0 || (!delta && event.keyCode == 40)) {

                    scrollBy(0, sizeScroll);

                }

                // Si autoHide est activé

                if (settings.autoHide) {

                    // On stocke le temps depuis le dernier scroll  

                    settings.lastScroll = Math.round(settings.date() / 1000);

                    // Si une fonction timeout est déjà programmé, on l'arrête...

                    if (settings.timerWheel) {
                        clearTimeout(settings.timerWheel);
                        settings.timerWheel = false;
                    }

                    // Pour la relancer avec le temps depuis le dernier scroll mis a jour 

                    method.hideBar();

                    // Et enfin l'affichée si elle ne l'est pas déjà

                    method.showBar();

                }



            });

            // Pour éviter de déclencher le drag and drop de firefox

            $(document).on('dragstart', function(event) {

                return false;

            });

            // Lorsque le bouton de la souris est pressé sur asBarBody

            $(document).on('mousedown', '#asBarBody', function(event) {

                // Rends le site non selectable pendant la durée du drag

                $('html').attr('unselectable', 'on').css('user-select', 'none');

                // Changer l'etat de barHold pour indiquer le bouton de la souris est pressé

                settings.barHold = true;

                // Stockage de la position  Y du curseur a cet instant

                settings.msPageY = event.pageY - settings.heightScroll();

                // Calcul de la position du curseur par rapport au début de asBarBody

                settings.barDiff = settings.msPageY - settings.barBodyTop();

                // Mettre la scroll bar dans l'event.target

                settings.target = $(event.target);

                // Arreter la propagation d'event pour ne pas appliquer la fonction aux éléments parents

                event.stopImmediatePropagation();

                // Fonction a appliquer lorsque que le bouton de la souris est relaché

            }).on('mouseup', function() {

                // Verification que la fonction sur mousedown a fonctionnée

                if (settings.barHold) {

                    // Changer l'etat de barHold pour indiquer le bouton de la souris est relachée

                    settings.barHold = false;

                    // Rends le site selectable a la fin du drag

                    $('html').removeAttr('unselectable').css('user-select', 'all');

                    if (settings.autoHide && settings.statutBar) {

                        setTimeout(function() {

                            if (settings.statutBar && !settings.barIn) {

                                $('#asBar, #asBarBody').animate({
                                    opacity: 0
                                }, 'slow');

                                settings.statutBar = false;

                            }

                        }, settings.delayHideBar);

                    }

                }

                // Target remise a null a la fin du drag  

                settings.target = null;

            });

            // Lorsque le curseur est déplacé

            $($(this)).on('mousemove', function(event) {

                // Si le bouton de la souris est pressé sur asBarBody, que la derniere fonction remonte à plus de 100ms et que target contient bien l'élement scrollBar 

                if (settings.barHold && !settings.scrollDelayTime && settings.target) {

                    // On passe le delay a true pour éviter que la fonction ne recommence avant 100ms

                    settings.scrollDelayTime = true;

                    setTimeout(function() {

                        // Déclaration et calcul des variable nécéssaires

                        var heightScroll = settings.heightScroll(),
                            barBodyTop = settings.barBodyTop(),
                            barTop = settings.barTop(),
                            barHeight = settings.barHeight(),
                            barBodyHeight = settings.barBodyHeight(),
                            bPos = (event.pageY - heightScroll) - settings.barDiff,
                            temp = 0;

                        // Si la nouvelle position de la scroll bar reste dans son container

                        if (barTop && settings.target != null) {

                            temp = bPos > barTop ? bPos : barTop;

                            if (bPos > barHeight - barBodyHeight) temp = barHeight - barBodyHeight + barTop;

                            // Déplacement de la scrollBar

                            settings.animate ? settings.target.animate({
                                top: temp + 'px'
                            }, {
                                duration: 40
                            }) : settings.target.css({
                                top: temp + 'px'
                            });

                            // Scroll de la fenêtre

                            $(settings.scrollElement).scrollTop(parseInt((settings.docTotalHeight - settings.docHeight) * (barBodyTop - barTop) / (barHeight - barBodyHeight)));

                            settings.scrollEvent = true;

                        }


                        console.log(bPos);

                        // Quand tout est bon, ça fais 100ms, delay remis a false pour permettre de réexécuter la fonction

                        settings.scrollDelayTime = false;

                    }, 80);

                }

            });

            // Lorsque que la souris passe dans la scrollBar

            if (settings.autoHide) {

                $(document).on('mouseenter', '#asBar', function(e) {

                    if (settings.autoHide) {

                        // on affiche la scrollbar

                        method.showBar();

                    }

                    // barIn est un bool qui indique si la souris est dans la scrollbar. Ici, passée a true

                    settings.barIn = true;

                }).on('mouseleave', '#asBar', function(e) {

                    // Quand la souris sors de la scrollBar

                    if (!settings.barHold) {

                        setTimeout(function() {
                            if (!settings.statutBar) $('#asBar, #asBarBody').animate({
                                opacity: 0
                            }, 'slow');
                        }, settings.delayHideBar);

                        settings.statutBar = false;

                    }

                    settings.barIn = false;

                });

            }

            // Fonction qui vérifie toutes les secondes si la hauteur de la page à changée

        });

    }

})(jQuery);