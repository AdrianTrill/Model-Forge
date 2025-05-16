/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 2.0, "minX": 0.0, "maxY": 98.0, "series": [{"data": [[0.0, 2.0], [0.1, 4.0], [0.2, 5.0], [0.3, 5.0], [0.4, 5.0], [0.5, 5.0], [0.6, 5.0], [0.7, 5.0], [0.8, 5.0], [0.9, 5.0], [1.0, 5.0], [1.1, 6.0], [1.2, 6.0], [1.3, 6.0], [1.4, 6.0], [1.5, 6.0], [1.6, 6.0], [1.7, 7.0], [1.8, 7.0], [1.9, 8.0], [2.0, 8.0], [2.1, 8.0], [2.2, 8.0], [2.3, 9.0], [2.4, 9.0], [2.5, 9.0], [2.6, 9.0], [2.7, 10.0], [2.8, 10.0], [2.9, 10.0], [3.0, 10.0], [3.1, 10.0], [3.2, 11.0], [3.3, 11.0], [3.4, 11.0], [3.5, 11.0], [3.6, 11.0], [3.7, 12.0], [3.8, 12.0], [3.9, 12.0], [4.0, 12.0], [4.1, 12.0], [4.2, 12.0], [4.3, 13.0], [4.4, 13.0], [4.5, 13.0], [4.6, 13.0], [4.7, 13.0], [4.8, 13.0], [4.9, 14.0], [5.0, 14.0], [5.1, 14.0], [5.2, 14.0], [5.3, 14.0], [5.4, 14.0], [5.5, 15.0], [5.6, 15.0], [5.7, 15.0], [5.8, 15.0], [5.9, 15.0], [6.0, 15.0], [6.1, 16.0], [6.2, 16.0], [6.3, 16.0], [6.4, 16.0], [6.5, 16.0], [6.6, 16.0], [6.7, 16.0], [6.8, 17.0], [6.9, 17.0], [7.0, 17.0], [7.1, 17.0], [7.2, 17.0], [7.3, 17.0], [7.4, 17.0], [7.5, 17.0], [7.6, 17.0], [7.7, 17.0], [7.8, 17.0], [7.9, 17.0], [8.0, 18.0], [8.1, 18.0], [8.2, 18.0], [8.3, 18.0], [8.4, 18.0], [8.5, 18.0], [8.6, 18.0], [8.7, 18.0], [8.8, 18.0], [8.9, 18.0], [9.0, 18.0], [9.1, 19.0], [9.2, 19.0], [9.3, 19.0], [9.4, 19.0], [9.5, 19.0], [9.6, 19.0], [9.7, 19.0], [9.8, 19.0], [9.9, 19.0], [10.0, 19.0], [10.1, 19.0], [10.2, 19.0], [10.3, 20.0], [10.4, 20.0], [10.5, 20.0], [10.6, 20.0], [10.7, 20.0], [10.8, 20.0], [10.9, 20.0], [11.0, 20.0], [11.1, 20.0], [11.2, 20.0], [11.3, 20.0], [11.4, 20.0], [11.5, 20.0], [11.6, 21.0], [11.7, 21.0], [11.8, 21.0], [11.9, 21.0], [12.0, 21.0], [12.1, 21.0], [12.2, 21.0], [12.3, 21.0], [12.4, 21.0], [12.5, 21.0], [12.6, 21.0], [12.7, 21.0], [12.8, 22.0], [12.9, 22.0], [13.0, 22.0], [13.1, 22.0], [13.2, 22.0], [13.3, 22.0], [13.4, 22.0], [13.5, 22.0], [13.6, 22.0], [13.7, 22.0], [13.8, 23.0], [13.9, 23.0], [14.0, 23.0], [14.1, 23.0], [14.2, 23.0], [14.3, 23.0], [14.4, 23.0], [14.5, 23.0], [14.6, 23.0], [14.7, 23.0], [14.8, 23.0], [14.9, 24.0], [15.0, 24.0], [15.1, 24.0], [15.2, 24.0], [15.3, 24.0], [15.4, 24.0], [15.5, 24.0], [15.6, 24.0], [15.7, 24.0], [15.8, 24.0], [15.9, 24.0], [16.0, 24.0], [16.1, 24.0], [16.2, 25.0], [16.3, 25.0], [16.4, 25.0], [16.5, 25.0], [16.6, 25.0], [16.7, 25.0], [16.8, 25.0], [16.9, 25.0], [17.0, 25.0], [17.1, 25.0], [17.2, 25.0], [17.3, 25.0], [17.4, 25.0], [17.5, 25.0], [17.6, 25.0], [17.7, 26.0], [17.8, 26.0], [17.9, 26.0], [18.0, 26.0], [18.1, 26.0], [18.2, 26.0], [18.3, 26.0], [18.4, 26.0], [18.5, 26.0], [18.6, 26.0], [18.7, 26.0], [18.8, 26.0], [18.9, 26.0], [19.0, 26.0], [19.1, 26.0], [19.2, 26.0], [19.3, 26.0], [19.4, 27.0], [19.5, 27.0], [19.6, 27.0], [19.7, 27.0], [19.8, 27.0], [19.9, 27.0], [20.0, 27.0], [20.1, 27.0], [20.2, 27.0], [20.3, 27.0], [20.4, 27.0], [20.5, 27.0], [20.6, 27.0], [20.7, 27.0], [20.8, 27.0], [20.9, 27.0], [21.0, 28.0], [21.1, 28.0], [21.2, 28.0], [21.3, 28.0], [21.4, 28.0], [21.5, 28.0], [21.6, 28.0], [21.7, 28.0], [21.8, 28.0], [21.9, 28.0], [22.0, 28.0], [22.1, 28.0], [22.2, 28.0], [22.3, 28.0], [22.4, 28.0], [22.5, 29.0], [22.6, 29.0], [22.7, 29.0], [22.8, 29.0], [22.9, 29.0], [23.0, 29.0], [23.1, 29.0], [23.2, 29.0], [23.3, 29.0], [23.4, 29.0], [23.5, 29.0], [23.6, 29.0], [23.7, 29.0], [23.8, 29.0], [23.9, 29.0], [24.0, 29.0], [24.1, 30.0], [24.2, 30.0], [24.3, 30.0], [24.4, 30.0], [24.5, 30.0], [24.6, 30.0], [24.7, 30.0], [24.8, 30.0], [24.9, 30.0], [25.0, 30.0], [25.1, 30.0], [25.2, 30.0], [25.3, 30.0], [25.4, 30.0], [25.5, 30.0], [25.6, 30.0], [25.7, 30.0], [25.8, 30.0], [25.9, 31.0], [26.0, 31.0], [26.1, 31.0], [26.2, 31.0], [26.3, 31.0], [26.4, 31.0], [26.5, 31.0], [26.6, 31.0], [26.7, 31.0], [26.8, 31.0], [26.9, 31.0], [27.0, 31.0], [27.1, 31.0], [27.2, 31.0], [27.3, 31.0], [27.4, 31.0], [27.5, 31.0], [27.6, 31.0], [27.7, 32.0], [27.8, 32.0], [27.9, 32.0], [28.0, 32.0], [28.1, 32.0], [28.2, 32.0], [28.3, 32.0], [28.4, 32.0], [28.5, 32.0], [28.6, 32.0], [28.7, 32.0], [28.8, 32.0], [28.9, 32.0], [29.0, 32.0], [29.1, 32.0], [29.2, 32.0], [29.3, 32.0], [29.4, 32.0], [29.5, 33.0], [29.6, 33.0], [29.7, 33.0], [29.8, 33.0], [29.9, 33.0], [30.0, 33.0], [30.1, 33.0], [30.2, 33.0], [30.3, 33.0], [30.4, 33.0], [30.5, 33.0], [30.6, 33.0], [30.7, 33.0], [30.8, 33.0], [30.9, 33.0], [31.0, 33.0], [31.1, 33.0], [31.2, 33.0], [31.3, 33.0], [31.4, 33.0], [31.5, 33.0], [31.6, 33.0], [31.7, 33.0], [31.8, 33.0], [31.9, 33.0], [32.0, 33.0], [32.1, 33.0], [32.2, 34.0], [32.3, 34.0], [32.4, 34.0], [32.5, 34.0], [32.6, 34.0], [32.7, 34.0], [32.8, 34.0], [32.9, 34.0], [33.0, 34.0], [33.1, 34.0], [33.2, 34.0], [33.3, 34.0], [33.4, 34.0], [33.5, 34.0], [33.6, 34.0], [33.7, 34.0], [33.8, 34.0], [33.9, 34.0], [34.0, 34.0], [34.1, 35.0], [34.2, 35.0], [34.3, 35.0], [34.4, 35.0], [34.5, 35.0], [34.6, 35.0], [34.7, 35.0], [34.8, 35.0], [34.9, 35.0], [35.0, 35.0], [35.1, 35.0], [35.2, 35.0], [35.3, 35.0], [35.4, 35.0], [35.5, 35.0], [35.6, 35.0], [35.7, 35.0], [35.8, 35.0], [35.9, 35.0], [36.0, 35.0], [36.1, 35.0], [36.2, 35.0], [36.3, 35.0], [36.4, 35.0], [36.5, 36.0], [36.6, 36.0], [36.7, 36.0], [36.8, 36.0], [36.9, 36.0], [37.0, 36.0], [37.1, 36.0], [37.2, 36.0], [37.3, 36.0], [37.4, 36.0], [37.5, 36.0], [37.6, 36.0], [37.7, 36.0], [37.8, 36.0], [37.9, 36.0], [38.0, 36.0], [38.1, 36.0], [38.2, 36.0], [38.3, 36.0], [38.4, 36.0], [38.5, 36.0], [38.6, 36.0], [38.7, 36.0], [38.8, 36.0], [38.9, 36.0], [39.0, 36.0], [39.1, 37.0], [39.2, 37.0], [39.3, 37.0], [39.4, 37.0], [39.5, 37.0], [39.6, 37.0], [39.7, 37.0], [39.8, 37.0], [39.9, 37.0], [40.0, 37.0], [40.1, 37.0], [40.2, 37.0], [40.3, 37.0], [40.4, 37.0], [40.5, 37.0], [40.6, 37.0], [40.7, 37.0], [40.8, 37.0], [40.9, 37.0], [41.0, 37.0], [41.1, 37.0], [41.2, 37.0], [41.3, 37.0], [41.4, 38.0], [41.5, 38.0], [41.6, 38.0], [41.7, 38.0], [41.8, 38.0], [41.9, 38.0], [42.0, 38.0], [42.1, 38.0], [42.2, 38.0], [42.3, 38.0], [42.4, 38.0], [42.5, 38.0], [42.6, 38.0], [42.7, 38.0], [42.8, 38.0], [42.9, 38.0], [43.0, 39.0], [43.1, 39.0], [43.2, 39.0], [43.3, 39.0], [43.4, 39.0], [43.5, 39.0], [43.6, 39.0], [43.7, 39.0], [43.8, 39.0], [43.9, 39.0], [44.0, 39.0], [44.1, 40.0], [44.2, 40.0], [44.3, 40.0], [44.4, 40.0], [44.5, 40.0], [44.6, 40.0], [44.7, 40.0], [44.8, 41.0], [44.9, 41.0], [45.0, 41.0], [45.1, 41.0], [45.2, 41.0], [45.3, 41.0], [45.4, 41.0], [45.5, 41.0], [45.6, 41.0], [45.7, 41.0], [45.8, 41.0], [45.9, 41.0], [46.0, 41.0], [46.1, 41.0], [46.2, 41.0], [46.3, 42.0], [46.4, 42.0], [46.5, 42.0], [46.6, 42.0], [46.7, 42.0], [46.8, 42.0], [46.9, 42.0], [47.0, 42.0], [47.1, 42.0], [47.2, 42.0], [47.3, 42.0], [47.4, 42.0], [47.5, 42.0], [47.6, 42.0], [47.7, 42.0], [47.8, 42.0], [47.9, 42.0], [48.0, 42.0], [48.1, 42.0], [48.2, 42.0], [48.3, 42.0], [48.4, 42.0], [48.5, 42.0], [48.6, 42.0], [48.7, 42.0], [48.8, 43.0], [48.9, 43.0], [49.0, 43.0], [49.1, 43.0], [49.2, 43.0], [49.3, 43.0], [49.4, 43.0], [49.5, 43.0], [49.6, 43.0], [49.7, 43.0], [49.8, 43.0], [49.9, 43.0], [50.0, 43.0], [50.1, 43.0], [50.2, 43.0], [50.3, 43.0], [50.4, 43.0], [50.5, 43.0], [50.6, 43.0], [50.7, 43.0], [50.8, 43.0], [50.9, 43.0], [51.0, 43.0], [51.1, 43.0], [51.2, 43.0], [51.3, 43.0], [51.4, 43.0], [51.5, 43.0], [51.6, 43.0], [51.7, 43.0], [51.8, 43.0], [51.9, 44.0], [52.0, 44.0], [52.1, 44.0], [52.2, 44.0], [52.3, 44.0], [52.4, 44.0], [52.5, 44.0], [52.6, 44.0], [52.7, 44.0], [52.8, 44.0], [52.9, 44.0], [53.0, 44.0], [53.1, 44.0], [53.2, 44.0], [53.3, 44.0], [53.4, 44.0], [53.5, 44.0], [53.6, 44.0], [53.7, 45.0], [53.8, 45.0], [53.9, 45.0], [54.0, 45.0], [54.1, 45.0], [54.2, 45.0], [54.3, 45.0], [54.4, 45.0], [54.5, 45.0], [54.6, 45.0], [54.7, 45.0], [54.8, 45.0], [54.9, 45.0], [55.0, 46.0], [55.1, 46.0], [55.2, 46.0], [55.3, 46.0], [55.4, 46.0], [55.5, 46.0], [55.6, 46.0], [55.7, 46.0], [55.8, 46.0], [55.9, 46.0], [56.0, 46.0], [56.1, 46.0], [56.2, 46.0], [56.3, 46.0], [56.4, 46.0], [56.5, 46.0], [56.6, 47.0], [56.7, 47.0], [56.8, 47.0], [56.9, 47.0], [57.0, 47.0], [57.1, 47.0], [57.2, 47.0], [57.3, 47.0], [57.4, 47.0], [57.5, 47.0], [57.6, 47.0], [57.7, 47.0], [57.8, 47.0], [57.9, 48.0], [58.0, 48.0], [58.1, 48.0], [58.2, 48.0], [58.3, 48.0], [58.4, 48.0], [58.5, 48.0], [58.6, 48.0], [58.7, 48.0], [58.8, 48.0], [58.9, 48.0], [59.0, 48.0], [59.1, 49.0], [59.2, 49.0], [59.3, 49.0], [59.4, 49.0], [59.5, 49.0], [59.6, 49.0], [59.7, 49.0], [59.8, 49.0], [59.9, 49.0], [60.0, 49.0], [60.1, 49.0], [60.2, 49.0], [60.3, 50.0], [60.4, 50.0], [60.5, 50.0], [60.6, 50.0], [60.7, 50.0], [60.8, 50.0], [60.9, 51.0], [61.0, 51.0], [61.1, 51.0], [61.2, 51.0], [61.3, 51.0], [61.4, 51.0], [61.5, 51.0], [61.6, 51.0], [61.7, 51.0], [61.8, 51.0], [61.9, 51.0], [62.0, 51.0], [62.1, 51.0], [62.2, 52.0], [62.3, 52.0], [62.4, 52.0], [62.5, 52.0], [62.6, 52.0], [62.7, 52.0], [62.8, 52.0], [62.9, 52.0], [63.0, 52.0], [63.1, 52.0], [63.2, 52.0], [63.3, 52.0], [63.4, 53.0], [63.5, 53.0], [63.6, 53.0], [63.7, 53.0], [63.8, 53.0], [63.9, 53.0], [64.0, 53.0], [64.1, 53.0], [64.2, 53.0], [64.3, 53.0], [64.4, 53.0], [64.5, 53.0], [64.6, 53.0], [64.7, 53.0], [64.8, 53.0], [64.9, 53.0], [65.0, 53.0], [65.1, 53.0], [65.2, 53.0], [65.3, 53.0], [65.4, 54.0], [65.5, 54.0], [65.6, 54.0], [65.7, 54.0], [65.8, 54.0], [65.9, 54.0], [66.0, 54.0], [66.1, 54.0], [66.2, 54.0], [66.3, 54.0], [66.4, 54.0], [66.5, 54.0], [66.6, 54.0], [66.7, 54.0], [66.8, 54.0], [66.9, 54.0], [67.0, 54.0], [67.1, 54.0], [67.2, 54.0], [67.3, 54.0], [67.4, 54.0], [67.5, 54.0], [67.6, 54.0], [67.7, 55.0], [67.8, 55.0], [67.9, 55.0], [68.0, 55.0], [68.1, 55.0], [68.2, 55.0], [68.3, 55.0], [68.4, 55.0], [68.5, 55.0], [68.6, 55.0], [68.7, 55.0], [68.8, 55.0], [68.9, 55.0], [69.0, 55.0], [69.1, 55.0], [69.2, 55.0], [69.3, 55.0], [69.4, 55.0], [69.5, 55.0], [69.6, 55.0], [69.7, 55.0], [69.8, 55.0], [69.9, 55.0], [70.0, 55.0], [70.1, 55.0], [70.2, 56.0], [70.3, 56.0], [70.4, 56.0], [70.5, 56.0], [70.6, 56.0], [70.7, 56.0], [70.8, 56.0], [70.9, 56.0], [71.0, 56.0], [71.1, 56.0], [71.2, 56.0], [71.3, 56.0], [71.4, 56.0], [71.5, 56.0], [71.6, 56.0], [71.7, 56.0], [71.8, 56.0], [71.9, 56.0], [72.0, 56.0], [72.1, 56.0], [72.2, 56.0], [72.3, 57.0], [72.4, 57.0], [72.5, 57.0], [72.6, 57.0], [72.7, 57.0], [72.8, 57.0], [72.9, 57.0], [73.0, 57.0], [73.1, 57.0], [73.2, 57.0], [73.3, 57.0], [73.4, 57.0], [73.5, 57.0], [73.6, 57.0], [73.7, 57.0], [73.8, 57.0], [73.9, 57.0], [74.0, 57.0], [74.1, 57.0], [74.2, 57.0], [74.3, 57.0], [74.4, 57.0], [74.5, 57.0], [74.6, 57.0], [74.7, 57.0], [74.8, 57.0], [74.9, 57.0], [75.0, 58.0], [75.1, 58.0], [75.2, 58.0], [75.3, 58.0], [75.4, 58.0], [75.5, 58.0], [75.6, 58.0], [75.7, 58.0], [75.8, 58.0], [75.9, 58.0], [76.0, 58.0], [76.1, 58.0], [76.2, 58.0], [76.3, 58.0], [76.4, 58.0], [76.5, 58.0], [76.6, 58.0], [76.7, 58.0], [76.8, 58.0], [76.9, 58.0], [77.0, 58.0], [77.1, 58.0], [77.2, 58.0], [77.3, 58.0], [77.4, 58.0], [77.5, 58.0], [77.6, 59.0], [77.7, 59.0], [77.8, 59.0], [77.9, 59.0], [78.0, 59.0], [78.1, 59.0], [78.2, 59.0], [78.3, 59.0], [78.4, 59.0], [78.5, 59.0], [78.6, 59.0], [78.7, 59.0], [78.8, 59.0], [78.9, 59.0], [79.0, 60.0], [79.1, 60.0], [79.2, 60.0], [79.3, 60.0], [79.4, 60.0], [79.5, 60.0], [79.6, 60.0], [79.7, 60.0], [79.8, 60.0], [79.9, 60.0], [80.0, 60.0], [80.1, 60.0], [80.2, 60.0], [80.3, 60.0], [80.4, 60.0], [80.5, 60.0], [80.6, 60.0], [80.7, 60.0], [80.8, 60.0], [80.9, 60.0], [81.0, 60.0], [81.1, 60.0], [81.2, 60.0], [81.3, 61.0], [81.4, 61.0], [81.5, 61.0], [81.6, 61.0], [81.7, 61.0], [81.8, 61.0], [81.9, 61.0], [82.0, 61.0], [82.1, 61.0], [82.2, 61.0], [82.3, 61.0], [82.4, 61.0], [82.5, 61.0], [82.6, 61.0], [82.7, 61.0], [82.8, 61.0], [82.9, 61.0], [83.0, 61.0], [83.1, 61.0], [83.2, 61.0], [83.3, 61.0], [83.4, 61.0], [83.5, 61.0], [83.6, 61.0], [83.7, 62.0], [83.8, 62.0], [83.9, 62.0], [84.0, 62.0], [84.1, 62.0], [84.2, 62.0], [84.3, 62.0], [84.4, 62.0], [84.5, 62.0], [84.6, 62.0], [84.7, 62.0], [84.8, 62.0], [84.9, 62.0], [85.0, 62.0], [85.1, 62.0], [85.2, 62.0], [85.3, 62.0], [85.4, 62.0], [85.5, 62.0], [85.6, 62.0], [85.7, 63.0], [85.8, 63.0], [85.9, 63.0], [86.0, 63.0], [86.1, 63.0], [86.2, 63.0], [86.3, 63.0], [86.4, 63.0], [86.5, 63.0], [86.6, 63.0], [86.7, 63.0], [86.8, 63.0], [86.9, 63.0], [87.0, 63.0], [87.1, 63.0], [87.2, 63.0], [87.3, 63.0], [87.4, 63.0], [87.5, 63.0], [87.6, 63.0], [87.7, 63.0], [87.8, 63.0], [87.9, 64.0], [88.0, 64.0], [88.1, 64.0], [88.2, 64.0], [88.3, 64.0], [88.4, 64.0], [88.5, 64.0], [88.6, 64.0], [88.7, 64.0], [88.8, 64.0], [88.9, 64.0], [89.0, 64.0], [89.1, 64.0], [89.2, 64.0], [89.3, 64.0], [89.4, 64.0], [89.5, 64.0], [89.6, 64.0], [89.7, 64.0], [89.8, 65.0], [89.9, 65.0], [90.0, 65.0], [90.1, 65.0], [90.2, 65.0], [90.3, 65.0], [90.4, 65.0], [90.5, 65.0], [90.6, 65.0], [90.7, 65.0], [90.8, 65.0], [90.9, 65.0], [91.0, 65.0], [91.1, 65.0], [91.2, 65.0], [91.3, 65.0], [91.4, 65.0], [91.5, 65.0], [91.6, 66.0], [91.7, 66.0], [91.8, 66.0], [91.9, 66.0], [92.0, 66.0], [92.1, 66.0], [92.2, 66.0], [92.3, 66.0], [92.4, 66.0], [92.5, 66.0], [92.6, 66.0], [92.7, 67.0], [92.8, 67.0], [92.9, 67.0], [93.0, 67.0], [93.1, 67.0], [93.2, 67.0], [93.3, 67.0], [93.4, 67.0], [93.5, 68.0], [93.6, 68.0], [93.7, 68.0], [93.8, 68.0], [93.9, 68.0], [94.0, 68.0], [94.1, 68.0], [94.2, 69.0], [94.3, 69.0], [94.4, 69.0], [94.5, 69.0], [94.6, 69.0], [94.7, 69.0], [94.8, 70.0], [94.9, 70.0], [95.0, 70.0], [95.1, 70.0], [95.2, 70.0], [95.3, 70.0], [95.4, 70.0], [95.5, 70.0], [95.6, 71.0], [95.7, 71.0], [95.8, 71.0], [95.9, 71.0], [96.0, 71.0], [96.1, 71.0], [96.2, 71.0], [96.3, 72.0], [96.4, 72.0], [96.5, 72.0], [96.6, 73.0], [96.7, 73.0], [96.8, 73.0], [96.9, 73.0], [97.0, 74.0], [97.1, 74.0], [97.2, 74.0], [97.3, 74.0], [97.4, 74.0], [97.5, 75.0], [97.6, 75.0], [97.7, 75.0], [97.8, 76.0], [97.9, 76.0], [98.0, 77.0], [98.1, 77.0], [98.2, 78.0], [98.3, 78.0], [98.4, 79.0], [98.5, 80.0], [98.6, 81.0], [98.7, 81.0], [98.8, 82.0], [98.9, 83.0], [99.0, 87.0], [99.1, 88.0], [99.2, 89.0], [99.3, 91.0], [99.4, 92.0], [99.5, 93.0], [99.6, 94.0], [99.7, 95.0], [99.8, 96.0], [99.9, 98.0]], "isOverall": false, "label": "User Activity Stats", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 5000.0, "minX": 0.0, "maxY": 5000.0, "series": [{"data": [[0.0, 5000.0]], "isOverall": false, "label": "User Activity Stats", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 5000.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 5000.0, "series": [{"data": [[0.0, 5000.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 15.312379376895532, "minX": 1.74738876E12, "maxY": 17.68536052439909, "series": [{"data": [[1.74738876E12, 15.312379376895532], [1.74738882E12, 17.68536052439909]], "isOverall": false, "label": "Statistics Endpoints Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.74738882E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 5.392405063291139, "minX": 1.0, "maxY": 66.34285714285717, "series": [{"data": [[2.0, 5.392405063291139], [3.0, 9.294117647058824], [4.0, 12.062499999999998], [5.0, 15.20168067226891], [6.0, 18.33750000000001], [7.0, 22.575757575757578], [8.0, 22.707317073170735], [9.0, 27.275590551181107], [10.0, 26.493902439024385], [11.0, 28.361256544502616], [12.0, 31.428571428571423], [13.0, 32.71428571428572], [14.0, 35.04065040650406], [15.0, 37.824218750000014], [1.0, 11.6], [16.0, 43.4218181818182], [17.0, 46.77454545454544], [18.0, 49.006430868167214], [19.0, 52.37021276595745], [20.0, 59.16935483870969], [21.0, 60.022641509433996], [22.0, 62.6287878787879], [23.0, 59.88741721854306], [24.0, 61.32797427652733], [25.0, 66.34285714285717], [26.0, 60.92857142857143]], "isOverall": false, "label": "User Activity Stats", "isController": false}, {"data": [[15.96400000000008, 43.199999999999946]], "isOverall": false, "label": "User Activity Stats-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 26.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 3180.7833333333333, "minX": 1.74738876E12, "maxY": 102825.45, "series": [{"data": [[1.74738876E12, 102825.45], [1.74738882E12, 38924.55]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.74738876E12, 8402.55], [1.74738882E12, 3180.7833333333333]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.74738882E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 40.156327543424275, "minX": 1.74738876E12, "maxY": 51.240349599417335, "series": [{"data": [[1.74738876E12, 40.156327543424275], [1.74738882E12, 51.240349599417335]], "isOverall": false, "label": "User Activity Stats", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.74738882E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 40.136476426799106, "minX": 1.74738876E12, "maxY": 51.23160961398394, "series": [{"data": [[1.74738876E12, 40.136476426799106], [1.74738882E12, 51.23160961398394]], "isOverall": false, "label": "User Activity Stats", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.74738882E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.0, "minX": 1.74738876E12, "maxY": 0.014888337468982653, "series": [{"data": [[1.74738876E12, 0.014888337468982653], [1.74738882E12, 0.0]], "isOverall": false, "label": "User Activity Stats", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.74738882E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 2.0, "minX": 1.74738876E12, "maxY": 98.0, "series": [{"data": [[1.74738876E12, 98.0], [1.74738882E12, 98.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.74738876E12, 4.0], [1.74738882E12, 2.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.74738876E12, 62.0], [1.74738882E12, 71.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.74738876E12, 78.0], [1.74738882E12, 95.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.74738876E12, 39.0], [1.74738882E12, 57.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.74738876E12, 66.0], [1.74738882E12, 76.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.74738882E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 10.0, "minX": 263.0, "maxY": 63.0, "series": [{"data": [[263.0, 10.0], [319.0, 20.0], [321.0, 52.0], [336.0, 60.0], [348.0, 27.0], [354.0, 25.0], [355.0, 53.0], [380.0, 57.0], [368.0, 61.0], [386.0, 31.0], [399.0, 35.0], [390.0, 42.0], [393.0, 45.0], [388.0, 63.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 399.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 10.0, "minX": 263.0, "maxY": 63.0, "series": [{"data": [[263.0, 10.0], [319.0, 19.0], [321.0, 52.0], [336.0, 60.0], [348.0, 27.0], [354.0, 25.0], [355.0, 53.0], [380.0, 57.0], [368.0, 61.0], [386.0, 31.0], [399.0, 35.0], [390.0, 42.0], [393.0, 44.0], [388.0, 63.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 399.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 22.466666666666665, "minX": 1.74738876E12, "maxY": 60.86666666666667, "series": [{"data": [[1.74738876E12, 60.86666666666667], [1.74738882E12, 22.466666666666665]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.74738882E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 22.883333333333333, "minX": 1.74738876E12, "maxY": 60.45, "series": [{"data": [[1.74738876E12, 60.45], [1.74738882E12, 22.883333333333333]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.74738882E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 22.883333333333333, "minX": 1.74738876E12, "maxY": 60.45, "series": [{"data": [[1.74738876E12, 60.45], [1.74738882E12, 22.883333333333333]], "isOverall": false, "label": "User Activity Stats-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.74738882E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 22.883333333333333, "minX": 1.74738876E12, "maxY": 60.45, "series": [{"data": [[1.74738876E12, 60.45], [1.74738882E12, 22.883333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.74738882E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 10800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

