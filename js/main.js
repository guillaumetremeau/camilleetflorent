/*
Title: Main JS File
Theme Name: Wedding
Author Name: FairyTheme
Author URI: http://themeforest.net/user/fairytheme
====================*/
/*
Table of Contents:
------------------
1. Windows on Load
2. Windows on Scroll
3. SVG loader
4. Navbar collapse
5. Circle type
6. Slick slider
7. Countdown
8. Form
9. Page scroll
10. Parallax
*/

(function () {
    "use strict";
    /* 1. Windows on Load
	====================*/
    $(window).on("load", function () {
        //$('.loader').delay(3000).fadeOut('slow');
        var $grid = $(".grid").masonry({
            itemSelector: ".grid-item",
            percentPosition: true,
            columnWidth: ".grid-sizer",
        });
    });

    /* 2. Windows on Scroll
	====================*/
    var winScrollTop = 0;
    $(window).on("scroll", function () {
        var nav = $("#navbar");
        var top = 200;
        if ($(window).scrollTop() >= top) {
            nav.addClass("onscroll");
        } else {
            nav.removeClass("onscroll");
        }
        winScrollTop = $(this).scrollTop();
        parallax();
    });

    /* 3. SVG loader
	====================*/
    function mycallback() {
        this.el.classList.add("finish");
        setTimeout(showPage, 1500);
        setTimeout(() => {
            showSnackBar();
        }, 2000);
    }
    Vivus.prototype.myremoveclass = function () {
        this.el.classList.remove("finish");
    };
    var loaderSvg = new Vivus(
        "my-svg",
        {
            type: "oneByOne",
            duration: 80,
            file: "img/loader.svg",
            start: "autostart",
            dashGap: 20,
            forceRender: false,
        },
        mycallback
    );

    /* 4. Navbar collapse
	====================*/
    $(".navbar-nav>li>a")
        .not(".dropdown-toggle")
        .on("click", function () {
            $(".navbar-collapse").collapse("hide");
        });

    /* 5. Circle type
	====================*/
    if ($("#js-circle-type").length) {
        new CircleType(document.getElementById("js-circle-type")).radius(384);
    }

    /* 6. Slider
	====================*/
    var slider = function () {
        if ($(".carousel")) {
            $(".carousel").slick({
                lazyLoad: "progressive",
                centerMode: true,
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                variableWidth: true,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            variableWidth: false,
                            centerMode: true,
                            adaptiveHeight: true,
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            dots: false,
                            variableWidth: false,
                            centerMode: true,
                            adaptiveHeight: true,
                        },
                    },
                ],
            });
            $(".carousel").slickLightbox({
                src: "src",
                itemSelector: ".scroll-item img",
            });
        }
    };

    /* 7. Countdown
	====================*/
    var countdown = function () {
        var countdown = document.querySelector(".countdown");

        function getTimeRemaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                total: t,
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            };
        }

        function initializeClock(id, endtime) {
            var clock = document.getElementById(id);
            var daysSpan = clock.querySelector(".days");
            var hoursSpan = clock.querySelector(".hours");
            var minutesSpan = clock.querySelector(".minutes");
            var secondsSpan = clock.querySelector(".seconds");
            var newChild;

            function updateClock() {
                var t = getTimeRemaining(endtime);
                var daysArr = String(t.days).split("");
                daysSpan.innerHTML = "";
                for (var i = 0; i < daysArr.length; i++) {
                    newChild = document.createElement("span");
                    newChild.innerHTML = daysArr[i];
                    daysSpan.appendChild(newChild);
                }
                var hoursArr = String(("0" + t.hours).slice(-2)).split("");
                hoursSpan.innerHTML = "";
                for (var i = 0; i < hoursArr.length; i++) {
                    newChild = document.createElement("span");
                    newChild.innerHTML = hoursArr[i];
                    hoursSpan.appendChild(newChild);
                }
                var minuteArr = String(("0" + t.minutes).slice(-2)).split("");
                minutesSpan.innerHTML = "";
                for (var i = 0; i < minuteArr.length; i++) {
                    newChild = document.createElement("span");
                    newChild.innerHTML = minuteArr[i];
                    minutesSpan.appendChild(newChild);
                }
                var secondArr = String(("0" + t.seconds).slice(-2)).split("");
                secondsSpan.innerHTML = "";
                for (var i = 0; i < secondArr.length; i++) {
                    newChild = document.createElement("span");
                    newChild.innerHTML = secondArr[i];
                    secondsSpan.appendChild(newChild);
                }
                if (t.total <= 0) {
                    clearInterval(timeinterval);
                }
            }
            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
        }
        // set your wedding date here
        var deadline = "August 2 2021 14:30:00 GMT+0100";
        if (countdown) {
            initializeClock("timer", deadline);
        }
    };

    /* 8. Form
	====================*/
    function filledLabels() {
        var inputFields = $(".control-label").next();
        inputFields.each(function () {
            var singleInput = $(this);
            singleInput.on("focus blur", function (event) {
                checkVal(singleInput);
            });
        });
    }

    function checkVal(inputField) {
        if (inputField.val() === "") {
            if (event.type === "focus") {
                inputField.prev(".control-label").addClass("filled");
            } else if (event.type === "blur") {
                inputField.prev(".control-label").removeClass("filled");
            }
        }
    }
    /*
		function submitForm() {
			var $form = $('#rsvp-form');
			$form.submit(function (e) {
				$form.find('.error-msg').remove();
				$form.find('input').removeClass('error');
				var formData = {
					"participation": $form.find('input#participationTrue').prop('checked') | !$form.find('input#participationFalse').prop('checked'),
					"names": $form.find('input#inputName').val(),
					"firstName": $form.find('input#inputFirstName').val(),
					"email": $form.find('input#inputEmail').val(),
					"countGuest": $form.find('input#inputCountGuest').val(),
					"comment": $form.find('#inputComment').val()
				};
				// formData = JSON.stringify(formData);
				// console.log(formData);
				 formData = {
					"one": "Singular sensation",
					"two": "Beady little eyes",
					"three": "Little birds pitch by my doorstep"
				}; 
				//formData = JSON.stringify(formData);
				
				console.log(formData);
				formData = JSON.stringify(formData);
				console.log(formData);
				//let parsed = JSON.parse(formData);
				//console.log(parsed);

				console.log('try');
				$.ajax({
					type: 'post',
					url: '{"mydate": "123"}',
					data: formData,
					dataType: 'json',
					encode: true,
					error: function (jqXHR, textStatus, errorThrown) {
						var test = $.parseJSON(jqXHR.responseText);
						var test2 = $.parseJSON(test.d);
						alert(test2[0].Name);
					}
				}).done(function(data) {
					console.log(data.message);
					if (data.success) {
						$('.success-msg').html('');
						$('.success-msg').html(data.message);
					} else {
						if (data.errors.names) {
							$('#inputName').addClass('error').after('<span class="error-msg">'+data.errors.name+'</span>');
						} else if (data.errors.participation) {
							$('#participationFalse').addClass('error').after('<span class="error-msg">'+data.errors.participation+'</span>');
						} else if (data.errors.firstNames) {
							$('#inputFirstName').addClass('error').after('<span class="error-msg">'+data.errors.firstNames+'</span>');
						} else if (data.errors.email) {
							$('#inputEmail').addClass('error').after('<span class="error-msg">'+data.errors.email+'</span>');
						} else if (data.errors.countGuest) {
							$('#inputCountGuest').addClass('error').after('<span class="error-msg">'+data.errors.countGuest+'</span>');
						}				
					}
				});
				e.preventDefault();
			});
		};*/
    /* 9. Page scroll
	====================*/
    var pageScroll = function () {
        $("body").on("click touch", ".page-scroll", function (event) {
            var $anchor = $(this);
            $("html, body")
                .stop()
                .animate(
                    {
                        scrollTop: $($anchor.attr("href")).offset().top,
                    },
                    1500,
                    "easeInOutExpo"
                );
            event.preventDefault();
        });
    };
    /* 10. Parallax
	====================*/
    $.fn.is_on_screen = function () {
        var win = $(window);
        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft(),
        };
        //viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        //bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return !(viewport.bottom < bounds.top || viewport.top > bounds.bottom);
    };

    function parallax() {
        var scrolled = $(window).scrollTop();
        $(".parallax").each(function () {
            if ($(this).is_on_screen()) {
                var firstTop = $(this).offset().top;
                var moveTop = (firstTop - winScrollTop) * 0.2; //speed;
                $(this).css("transform", "translateY(" + moveTop + "px)");
            }
        });
    }

    $(function () {
        slider();
        countdown();
        filledLabels();
        pageScroll();
    });

    // Snackbar
    function showSnackBar() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 10000);
    }
})();
