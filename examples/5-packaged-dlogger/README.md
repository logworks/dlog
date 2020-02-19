# packaged dlogger

' inclusion ' definition: require/import/whatever next module system!

Its common practice to prevent inclusion of files above the ./src directory,
eg: requre('../../dlogger.js').

By default, dlog + incluses ./Dlogger.js from projects root dir, and works out the path to src/..?n times/dlogger.js.

When .dlogrc has the "dloggerPackage" : "your-packaged-dlogger" option the relative pathing is not needed, and is turned off.

This has benefits beyond a work around for inclusing outside of src.
One is a way of sharing configuration and customisations for dlog say within an organisation.
A second is it becomes trivial to have a node and web standard configuration for an organisation, and other sharing options opened up.

This folder is an example of this. Note, it uses file:// pathing so no npm publish is required, great for hacking/trying out, quick start without publishing steps.
