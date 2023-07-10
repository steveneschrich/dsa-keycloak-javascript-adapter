import router from "@girder/core/router";
import events from "@girder/core/events";

import redirectView from "./views/RedirectView";
import CollectionNotFound from "./views/CollectionNotFoundView";

router.route("redirect/", "redirect", function () {
    events.trigger("g:navigateTo", redirectView);
});

router.route("collectionNotFound", "collection", function () {
    events.trigger("g:navigateTo", CollectionNotFound);
});
