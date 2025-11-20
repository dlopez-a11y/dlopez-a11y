// nice select
$(document).ready(() => {
    $('#header').load("/assets/header.html");
    $('#footer').load("/assets/footer.html");

    setTimeout(() => {
        $('a[target="_blank"]').each(function (index, element) {
            if ($(element).find('img').length == 0 && $(element).find('[role="img"]').length == 0) {
                $(element).append('<i class="bi bi-box-arrow-up-right"></i>');
            }
            $(element).attr('aria-details', 'Abre en nueva pestaña');
        });
    }, 1);
});

'use strict';

class Popup {
    constructor(domNode) {
        var container;

        container = document.createElement('span');
        container.classList.add('popup-container');
        domNode.after(container);
        container.append(domNode);

        // Get the message from the title or data-popover element
        if (domNode.hasAttribute('title')) {
            container.innerHTML += '<span role="tooltip" aria-hidden="true"><span>' + domNode.getAttribute('title') + '</span></span>';
            domNode = container.querySelector('[title]');
        }

        if (domNode.hasAttribute('data-popover')) {
            container.innerHTML += '<span role="status"><span></span></span>';
            domNode = container.querySelector('[data-popover]');
            domNode.setAttribute('aria-pressed', false);
        }
    }
}

class Tooltip {
    constructor(domNode) {
        this.tooltipNode = domNode;
        this.tooltipNode.parentNode.addEventListener('mouseover', () => this.onMouseover(event));
        this.tooltipNode.parentNode.addEventListener('mouseleave', () => this.onMouseleave(event));
        this.tooltipNode.addEventListener('focus', () => this.onFocus(event));
        this.tooltipNode.addEventListener('blur', () => this.onBlur(event));
        document.addEventListener('keydown', () => this.onKeydown(event));
        domNode.removeAttribute('title');
    }

    // Toggle the message
    onMouseover(event) {
        event.currentTarget.classList.add('hover');
    }

    onMouseleave(event) {
        event.currentTarget.classList.remove('hover');
    }

    // Close on outside
    onFocus(event) {
        event.currentTarget.classList.add('focused');
    }

    onBlur(event) {
        event.currentTarget.classList.remove('focused');
    }

    // Remove tooltip on ESC
    onKeydown(event) {
        if ((event.keyCode || event.which) === 27) {
            Array.from(document.querySelectorAll('.popup-container')).forEach((el) => {
                el.classList.remove('hover');
                el.firstChild.classList.remove('focused');
            });
        }
    }
}

class Popover {
    constructor(domNode) {
        this.popoverNode = domNode;
        this.popoverNode.addEventListener('click', () => this.onClick(event));
        document.addEventListener('click', () => this.onClickOut(event));
        document.addEventListener('keydown', () => this.onKeydown(event));
    }

    // Toggle the message
    onClick(event) {
        if (event.currentTarget.parentNode.classList.contains('open')) {
            event.currentTarget.parentNode.classList.remove('open');
            event.currentTarget.parentNode.querySelector('[role="status"]').querySelector('span').innerText = '';
        } else {
            event.currentTarget.parentNode.classList.add('open');
            var el = event.currentTarget.parentNode.querySelector('[role="status"]').querySelector('span');
            var text = event.currentTarget.dataset.popover;
            setTimeout(() => {
                el.innerText = text;
            }, 1);
        }
    }

    // Close on outside click
    onClickOut(event) {
        Array.from(document.querySelectorAll('[data-popover]')).forEach((el) => {
            if (!el.parentNode.contains(event.target)) {
                el.parentNode.classList.remove('open');
                el.parentNode.querySelector('[role="status"]').querySelector('span').innerText = '';
                el.setAttribute('aria-pressed', false);
            }
        });
    }

    // Remove popover on ESC
    onKeydown(event) {
        if ((event.keyCode || event.which) === 27) {
            Array.from(document.querySelectorAll('[data-popover]')).forEach((el) => {
                el.parentNode.classList.remove('open');
                el.parentNode.querySelector('[role="status"]').querySelector('span').innerText = '';
                el.setAttribute('aria-pressed', false);
            });
        }
    }
}

class Pressed {
    constructor(domNode) {
        this.switchNode = domNode;
        this.switchNode.addEventListener('click', () => this.onClick(event));
    }

    onClick(event) {
        if (event.currentTarget.getAttribute('aria-pressed') === 'true') {
            event.currentTarget.setAttribute('aria-pressed', false);
        } else {
            event.currentTarget.setAttribute('aria-pressed', true);
        }
    }
}

class PasswordViewer {
    constructor(domNode) {
        this.switchNode = domNode;
        this.switchNode.addEventListener('click', () => this.onClick(event));
    }

    onClick(event) {
        if (event.currentTarget.getAttribute('aria-pressed') === 'false') {
            event.currentTarget.setAttribute('aria-label', 'Mostrar contraseña');
            event.currentTarget.parentNode.lastChild.lastChild.innerText = 'Mostrar contraseña';
            event.currentTarget.firstChild.classList.add('bi-eye');
            event.currentTarget.firstChild.classList.remove('bi-eye-slash');
            document.getElementById(event.currentTarget.dataset.target).setAttribute('type', 'password');
        } else {
            event.currentTarget.setAttribute('aria-label', 'Ocultar contraseña');
            event.currentTarget.parentNode.lastChild.lastChild.innerText = 'Ocultar contraseña';
            event.currentTarget.firstChild.classList.add('bi-eye-slash');
            event.currentTarget.firstChild.classList.remove('bi-eye');
            document.getElementById(event.currentTarget.dataset.target).setAttribute('type', 'text');
        }
    }
}

(function () {
    window.setTimeout(() => {
        // Iterate over them
        Array.from(document.querySelectorAll('[title], [data-popover]')).forEach((el) => new Popup(el));
        Array.from(document.querySelectorAll('[title]')).forEach((el) => new Tooltip(el));
        Array.from(document.querySelectorAll('[data-popover]')).forEach((el) => new Popover(el));
        Array.from(document.querySelectorAll('[aria-pressed]')).forEach((el) => new Pressed(el));
        Array.from(document.querySelectorAll('[type="password"] + * [aria-pressed]')).forEach((el) => new PasswordViewer(el));
    }, 100);
}());