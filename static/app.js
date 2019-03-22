// class MockSocketIO {
//     actions = {};
//     _interval = null;

//     constructor() {
//         this.start();
//     }

//     start() {
//         this._interval = this._interval || setInterval(this._generate_data.bind(this), 3000);
//     }

//     stop() {
//         if (this._interval) clearInterval(this._interval);
//     }

//     _generate_data() {
//         const value1 = Array(114).fill(0).map(() => Math.floor(Math.random() * 100));
//         const value2 = value1.map(v => Math.floor(v * Math.random()));
//         const value3 = value1.map(v => v + Math.floor(Math.random() * 20));
//         const time = new Date().getTime();
//         this.emit('server_response', {
//             values: [value1, value2, value3],
//             time
//         });
//     }

//     emit(evt, data) {
//         this.actions[evt].forEach(f => f(data));
//     }

//     on(evt, cb) {
//         this.actions[evt] = this.actions[evt] || [];
//         this.actions[evt].push(cb);
//     }

// }

class Chart {
    sources = [];
    chart = null;
    data = [];
    threshold = 0;

    option = {
        color: [
            '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
            '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
            '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
            '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
        ],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [{
                    name: 'X',
                    icon: 'roundRect'
                },
                {
                    name: 'Y',
                    icon: 'roundRect'
                },
                {
                    name: 'Z',
                    icon: 'roundRect'
                },
                {
                    name: 'Presence',
                    icon: 'circle'
                }
            ]
        },
        dataset: {
            source: [
                ['Time', 'X', 'Y', 'Z', 'Presence'],
                [new Date().getTime(), 0, 0, 0, 0]
            ]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: [{
                type: 'time',
                gridIndex: 0,
                splitLine: {
                    show: false
                }
            },
            {
                type: 'time',
                gridIndex: 1,
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [{
                gridIndex: 0,
                splitLine: {
                    show: false
                }
            },
            {
                gridIndex: 1,
                min: 0,
                max: 2,
                interval: 1,
                splitLine: {
                    show: false
                }
            }
        ],
        grid: [{
                bottom: '55%'
            },
            {
                top: '55%'
            }
        ],
        series: [{
                type: 'line',
                encode: {
                    x: 'Time',
                    y: 'X'
                },
                smooth: true,
                name: 'X'
            },
            {
                type: 'line',
                encode: {
                    x: 'Time',
                    y: 'Y'
                },
                smooth: true,
                name: 'Y'
            },
            {
                type: 'line',
                encode: {
                    x: 'Time',
                    y: 'Z'
                },
                smooth: true,
                name: 'Z'
            },
            {
                type: 'line',
                encode: {
                    x: 'Time',
                    y: 'Presence'
                },
                name: 'Presence',
                step: 'middle',
                xAxisIndex: 1,
                yAxisIndex: 1
            }
        ]
    };

    constructor(sources, el, threshold) {
        this.sources = sources;
        this.chart = echarts.init(el);
        this.threshold = threshold;
        this.chart.setOption(this.option);
    }

    addData(entry) {
        this.data.push(entry);
        if (this.option.dataset.source.length > 50) {
            this.option.dataset.source.shift();
        }
        this.option.dataset.source.push(this.formatData(entry));
        this.chart.setOption(this.option);
    }

    refresh() {
        const data = [
            ['Time', 'X', 'Y', 'Z', 'Presence']
        ].concat(this.data.slice(-50).map(v => this.formatData(v)));
        this.option.dataset.source = data;
        this.chart.setOption(this.option);
    }

    formatData(entry) {
        // entry = {time: 1550000000000, values: [3 x 114]}
        const data = entry.values.map((v, i) => v[this.sources[i].value || 0]);
        data.push(variance(data) > this.threshold ? 1 : 0);
        data.unshift(entry.time);
        return data;
    }
}

function variance(elements) {
    const avg = elements.reduce((a, b) => a + b, 0) / elements.length;
    const vrc = elements.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / elements.length;
    return Math.floor(vrc);
}

function resize(chartEl) {
    const size = chartEl.getBoundingClientRect().width * 1.2;
    chartEl.style.height = Math.max(200, Math.min(window.innerHeight * 0.7, size)) + 'px';
}

function init() {
    const sources = [...document.querySelectorAll('input')];

    const chartEl = document.getElementById('chart');
    resize(chartEl);

    const chart = new Chart(sources, chartEl, 1);
    sources.forEach(i => i.addEventListener('change', chart.refresh.bind(chart)));

    window.addEventListener('resize', () => {
        resize(chartEl);
        chart.chart.resize();
    });


    const socketio = new MockSocketIO();
    socketio.on('server_response', chart.addData.bind(chart));
}

window.onload = init;