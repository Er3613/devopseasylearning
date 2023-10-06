(function ($) {
    'use strict';

    $(window).load(function () {

        noticeModal();

        loadList();

        // Remove all status badges
        $(".juvo-modal").on("modal:after-close", function (event) {
            $(".session-list-delete-response", this).remove();
        });

    });

    /**
    Show general notice modal if limit is exceeded
     */
    function noticeModal() {
        let modal = $("#juvo-session-modal-exceeded")

        if (!modal.length) {
            return;
        }

        MicroModal.show(modal.attr('id'),{
            disableScroll: true,
            disableFocus: false
        });
    }

    /**
     * Load Session List
     */
    function loadList() {

        const container = $("#session-list");
        const replaceContainer = ".session-list-table";

        if (!container.length) {
            return;
        }

        var data = {
            '_wpnonce': ajax_var.nonce,
            'action': 'session_list'
        };

        $(".session-list-spinner", container).show()

        // Reload Data
        $.post(ajax_var.ajaxurl, data)
            .done(function (response) {
                $(replaceContainer, container).replaceWith(response);

                /* <fs_premium_only> */
                if ( window.juvo_session_manager.can_use_premium_code ) {
                    let modal = attachModalEvent($(replaceContainer, container));
                    attachButtonEvent(modal)
                }
                /* </fs_premium_only> */

            })
            .fail(function (response, textStatus, errorThrown) {
                $(replaceContainer, container).replaceWith("<p id='session-list-response' class='error'>" + errorThrown + "</p>");
            })
            .always(function () {
                $(".session-list-spinner", container).hide()
            });
    }


    /* <fs_premium_only> */
    /**
     * Attach Modal on click on table rows
     */
    function attachModalEvent(container) {
        $('tr[data-juvo-modal]', container).on('click', function () {
            let modal = $(this).data('juvo-modal');
            modal = $(modal);

            $(".session-list-delete-response", modal).remove();
            MicroModal.show(modal.attr('id'),{
                disableScroll: true,
                disableFocus: false
            });
            return modal;
        });
    }

    /**
     * Send deletion request on Button click and reload list
     */
    function attachButtonEvent(modal) {
        const button = $('button[data-modal-delete]', modal);

        button.on('click', function () {
            var data = {
                '_wpnonce': ajax_var.nonce,
                'action': 'session_delete',
                'verifier': $(this).data('modal-delete')
            };

            $.post(ajax_var.ajaxurl, data)
                .done(function (response) {
                    button.after("<p class='session-list-delete-response success'>" + response.message + "</p>");

                    // Redirect property only send if current session is deleted
                    if (response.redirect) {

                        setTimeout(function () {
                            window.location.replace(response.redirect);
                        }, 2500);

                        return;
                    }

                    loadList()

                    setTimeout(function () {
                        MicroModal.close(modal.attr('id'));
                    }, 3500);
                })
                .fail(function (response) {
                    let json = response.responseJSON;
                    button.after("<p class='session-list-delete-response error'>" + json + "</p>");
                })
        });
    }
    /* </fs_premium_only> */

})(jQuery);
