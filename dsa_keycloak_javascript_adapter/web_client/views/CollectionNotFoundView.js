import $ from "jquery";
import View from "@girder/core/views/View";

const CollectionNotFound = View.extend({
    initialize(settings) {
        $(".g-default-layout").append(`
            <h2> Collection not found or you don't have access to it</h2>
        `);
    },

    render() {
        render.call(this);
    },
});

export default CollectionNotFound;
