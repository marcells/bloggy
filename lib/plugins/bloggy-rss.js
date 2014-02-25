'use strict';

module.exports = {
    init : function (engine) {
        engine.getRssXml = function (callback) {
            var items = engine.entries.all.orderedByDate();

            engine.entries.load(items, function () {
                var xml = engine.getConfiguration().generateFeedXml({
                        lastChange: engine.entry.latest() ? engine.entry.latest().date : null,
                        entries: items,
                        tags: engine.tags.asNames()
                    }, engine.getOptions());

                callback(xml);
            });
        };
    }
};