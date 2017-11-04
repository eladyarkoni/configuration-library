<h1 style="text-align: center;">Configuration Library</h1>

Configuration Library for nodejs client applications.

<div style="text-align: center;">
    <img src="https://travis-ci.org/eladyarkoni/configuration-library.svg?branch=master">
</div>

## Project Description

1. The   library   initialization   should   expect   a   customer-key   that   we   provide   to   our   customers.
2. The   library   needs   to   expose   a   method   that   returns   a   single   value   based   on   a   key.
3. The   library   should   get   the   configuration   from   our   servers.
4. The   library   should   save   (cache)   the   configuration   for   future   launches   in   order   to   reduce
the   init   time.
5. Every   time   the   library   is   initialized,   it   should   get   the   configuration   file   from   the   server
(since   it   might   have   been   updated)
6. The   library   should   not   block   the   execution   of   the   app/service   while   getting   the
configuration   from   the   server.
7. The   library   should   expose   a   way   to   get   a   default   value.   In   case   there   is   no   locally   cached
configuration   (e.g.   first   time   ever,   the   app/service   starts),   and   the   customer   code
requests   a   value   for   a   key   before   the   response   from   the   servers   arrived.
8. A   real   scenario   is   for   the   configuration   to   be   used   for   feature   toggling.   Product   managers
might   use   this   configurations   to   toggle   on/off   features   in   the   code.
Like   all   new   things,   a   new   feature   can   have   problems   and   we   need   to   be   able   to   control these   changes.
For   example,   the   app   might   run   without   any   problem   for   a   long   time.   Then   someone turns   “on”   a   new   feature.   This   feature   crash   the   process.   In   the   case   that   the   process crashes,   we   will   want   to   disable   (turn   “off”)   the   feature   and   stop   the   app   from   crashing. Since   we   said   that   the   library   needs   to   get   the   configuration   from   the   configuration   server in   async   way,   the   process   might   load   a   cached   configuration   that   will   cause   the   crash before   the   it   gets   the   updated   response   with   the   disable   instruction   from   the   server. Every   time   the   app/process   will   starts,   it   will   crash   again.
Because   of   that,   the   the   library   needs   to   be   smart   and   detect   that   the   previous   process crashed.   If   it   did,   the   library   will   prevent   the   crash   of   process   while   getting   a   configuration from   the   server   (which   hopefully   fixes   the   crash).

## Prerequisites

- NodeJS v6.9+

## Setup Environment

- Please run npm install to install all dependencies.

## Run Tests
- All tests are under ./spec/**/*.spec.js, please review it for better understanding of the library functionality.
- use 'npm test' to run the library test

## Class Methods

- function init(props);
    - Library initialization
    - Properties:
        - key: customer key that used by the server for authentication
        - cacheFile: cached configuration path
        - crashFile: crash logfile path, this file is used by the library in order to do a different initialization flow in case of previous crash
        - server.domain: configuration server domain
        - server.apiPath: The REST api path to get and post the configuration
        
- function get(key, defaultValue);
    - Returns the value for a key
    - Parameters:
        - key: The key
        - defaultValue: The default value in case the key is missing for some reason

- function getProperties();
    - Returns the library properties