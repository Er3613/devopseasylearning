/**
 * Created by michaeldajewski on 1/13/23.
 */

(function ($) {
    'use strict';

    $(document).ready(function () {

        const animation = $('#loading-animation-search');

        $('#search-btn').click(function(e){
            elcSearchByID();
        });

        // Ajax
        const elcSearchByID = function () {
            const animation = $('#loading-animation-search');
            const certificate_id = $('#search_by_id').val();
            const submission = $('#xyq').val();
            const shortcode_args = elcCtidVerifierAJAX.shortcode_args;//$('#rtype').val();

            animation.show();

            $.ajax({
                url: elcCtidVerifierAJAX.url,
                type: 'GET',
                dataType: 'json',
                data: {
                    action: 'elc_ssc_catch_search_by_id',
                    post_id: elcCtidVerifierAJAX.post_id,
                    security: elcCtidVerifierAJAX.security,
                    submission: submission,
                    certificate_id: certificate_id,
                    shortcode_args: shortcode_args,
                },

                success: function (response) {
                    $('#search-table').html(response.data);
                    animation.hide();
                },

                error: function (error) {
                    animation.hide();
                }
            });
        };

        $('input#search_by_id').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                elcSearchByID();
            }
        });
    });

})(jQuery);
