conte = document.getElementById('cont_OTkyNTR8NXwyfDV8NHwyOTI5OWV8MXxGRkZGRkZ8Y3wx');enlace = document.getElementById('spa_OTkyNTR8NXwyfDV8NHwyOTI5OWV8MXxGRkZGRkZ8Y3wx');anchor = document.getElementById('a_OTkyNTR8NXwyfDV8NHwyOTI5OWV8MXxGRkZGRkZ8Y3wx');var url = anchor.href;var ua = navigator.userAgent.toLowerCase();check = function(r){return r.test(ua);};isWebKit = check(/webkit/);isGecko = !isWebKit &amp;&amp; check(/gecko/);var text = '';if(isGecko){text = encodeURI(anchor.text);} else {
                    text = encodeURI(anchor.innerText);
                }
                var exp1 = new RegExp('http://www.meteocity.com');
                var exp2 = new RegExp('M%C3%A9t%C3%A9o');
                var exp3 = new RegExp('M%C3%83%C2%A9t%C3%83%C2%A9o');
                if (conte &amp;&amp; enlace &amp;&amp; anchor &amp;&amp; exp1.test(url) &amp;&amp; (exp2.test(text) || exp3.test(text)) ){
                        enlace.style.cssText = 'font:normal 10px/12px Tahoma, Arial, Helvetica, serif; color:#333; padding:0 0 3px; text-decoration: none;';
                        conte.style.cssText = 'width:300px;';
                        elem = document.createElement('iframe');
                        elem.id = 'OTkyNTR8NXwyfDV8NHwyOTI5OWV8MXxGRkZGRkZ8Y3wx';
                        elem.src = 'http://widget.meteocity.com/OTkyNTR8NXwyfDV8NHwyOTI5OWV8MXxGRkZGRkZ8Y3wx/';
                        elem.frameBorder = 0;
                        elem.allowTransparency = true;
                        elem.scrolling = 'no';
                        elem.name = 'frame';
                        elem.height = '250';
                        elem.width = '300';
                        conte.insertBefore(elem,enlace);
                }