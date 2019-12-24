'use strict';
const { ReportBase } = require('istanbul-lib-report');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class AwsCloudwatchMetricsReport extends ReportBase {
  constructor(opts) {
    super();
    this.file = opts.file || 'metric_data.json';
  }

  onStart(root, context) {
    this.contentWriter = context.writer.writeFile(this.file);
    var summary = root.getCoverageSummary();
    var metrics = [];
    var timestamp = new Date();

    for (var dimension in summary.data) {
      for (var metricType in summary.data[dimension]) {
        var metric = {
          MetricName: capitalizeFirstLetter(metricType),
          Dimensions: [
            {
              Name: 'Coverage',
              Value: capitalizeFirstLetter(dimension),
            },
          ],
          Timestamp: timestamp,
          Unit: metricType === 'pct' ? 'Percent' : 'Count',
          Value: summary[dimension][metricType],
        };
        metrics.push(metric);
      }
    }

    this.contentWriter.write(JSON.stringify(metrics));
    this.contentWriter.close();
  };
}

module.exports = AwsCloudwatchMetricsReport;
