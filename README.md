== Workshop of the World Visualization ==

The location data has been gathered from [Bridge Troll](http://www.bridgetroll.org/). Contact Sarah Allen (@ultrasaurus) if you know of a city that is not representated.

To run locally, here's a list of [HTTP server one-liners](https://gist.github.com/willurd/5720255)

### Running data in map locally with Bridge Troll
* start Bridge Troll locally using `rails server`

* Update BridgeTroll and workshop-map source code
  * within BridgeTroll source code:
    * update `allow_insecure?` to `true`
    * `config/application.rb` add your local server
      * Ex: I am using `python -m SimpleHTTPServer`, so I added 'localhost:8000'. Resulting in: `origins 'bridgefoundry.org', 'localhost:8000'`
  * within this "workshop-map" repo
    * update `workshop-map.js` to include`.defer(d3.json, "http://localhost:3000/events.json?type=past")`, instead of `defer(d3.json, "https://bridgetroll.orb/events.json?type=all")`
      * you can set the `type` query param to "all", "past" or "future".

## Wish List
* The title should be part of the map, rather than on the index page, to make
  it easier to embed.
* Link to this repo in small text in the lower-right
* Resize map based on width and height. Note that currently the map is artfully
  cropped since we haven't had any workshops in the north and south poles, and
  we should keep that feature while allowing for setting width/height to
  grow or shrink the map. This would enable it to fit nicely in a blog post
  and be easily viewed on mobile devices.
* Show the map in the README

The following wish list items depend on some data wrangling in Bridge Troll.  We
would like the source to be dynamic so this doesn't get out of date, before it
gets too fancy.  Right now, we don't have new locations very often, so this map
is still useful, even thought the locations file needs to be updated manually.

* pull locations dynamically from an Bridge Troll API -- see https://github.com/railsbridge/bridge_troll/issues/499
* interactive exploration that shows locations by Bridge (default to all)
* click to go to chapter website (if they've got one)

Credits
* Sarah Allen: original d3 map
* Beverley Nelson, Kinsey Durham: 2013 data wrangling of historical data
* Lillie Chilen, Travis Grathwell: Bridge Troll external events & events.csv API
* Mary Jenn: 2015-2016 historical data wrangling
* Tim Garcia: more d3 wizardry
