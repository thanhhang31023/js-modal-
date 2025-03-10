const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(options = {}) {
    const { templateId, closeMethods = ["button", "overlay", "escape"] } =
        options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`#${templateId} does not exist!`);
        return;
    }

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    function getScrollbarWidth() {
        if (getScrollbarWidth.value) return getScrollbarWidth.value;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });

        document.body.appendChild(div);
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth;

        return scrollbarWidth;
    }

    this.open = () => {
        const content = template.content.cloneNode(true);

        // Create modal elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.onclick = () => this.close(backdrop);
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        // Attach event listeners
        if (this._allowBackdropClose) {
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    this.close(backdrop);
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close(backdrop);
                }
            });
        }

        return backdrop;
    };

    this.close = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };
    };
}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();

    const img = modalElement.querySelector("img");
    console.log(img);
};

const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal opened");
    },
    onClose: () => {
        console.log("Modal closed");
    },
});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};
