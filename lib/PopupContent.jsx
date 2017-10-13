import moment from "moment";

export default function PopupContent(result) {


  let latest_value_formatted,
    median_formatted,
    num_values_formatted,
    min_formatted,
    max_formatted,
    q1_formatted,
    q3_formatted,
    photo_url_div,
    onbekend_1,
    onbekend_2;
  let summer_formatted,
    winter_formatted,
    mean_formatted,
    date_formatted,
    std_formatted,
    p10_formatted,
    p90_formatted;
  onbekend_1 = "Niet bemeten";
  onbekend_2 = "Niet te bepalen";

  // let waarde_n = null;
  // if(results.results) {
  //   waarde_n = results.results[0].waarde_n;
  // }

  if (result.properties.latest_value === null) {
    latest_value_formatted = onbekend_1;
  } else {
    latest_value_formatted = result.properties.latest_value;
  }

  if (result.properties.photo_url) {
    photo_url_div = `<div><a href="${result.properties.photo_url}"
      target="_blank"><img width="200" src="${result.properties.photo_url}">
      </div>`;
  } else {
    photo_url_div = "<div><p><em>Geen afbeelding beschikbaar</em></p></div>";
  }

  if (result.properties.percentiles === null) {
    median_formatted = onbekend_1;
    min_formatted = onbekend_1;
    max_formatted = onbekend_1;
    std_formatted = onbekend_1;
    q1_formatted = onbekend_1;
    q3_formatted = onbekend_1;
    mean_formatted = onbekend_1;
    num_values_formatted = onbekend_1;
    winter_formatted = onbekend_1;
    winter_formatted = onbekend_1;
  } else {
    try {
      median_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.median.toFixed(2);
    } catch (error) {
      median_formatted = onbekend_1;
    }

    try {
      mean_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.mean.toFixed(2);
    } catch (error) {
      mean_formatted = onbekend_1;
    }

    try {
      date_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : moment(result.properties.latest_datetime).format("DD/MM/YYYY");
    } catch (error) {
      date_formatted = onbekend_1;
    }

    try {
      min_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.min.toFixed(2);
    } catch (error) {
      min_formatted = onbekend_1;
    }

    try {
      max_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.max.toFixed(2);
    } catch (error) {
      max_formatted = onbekend_1;
    }

    try {
      std_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.std.toFixed(2);
    } catch (error) {
      std_formatted = onbekend_1;
    }

    try {
      q1_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.q1.toFixed(2);
    } catch (error) {
      q1_formatted = onbekend_1;
    }

    try {
      q3_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.q3.toFixed(2);
    } catch (error) {
      q3_formatted = onbekend_1;
    }

    try {
      p10_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.p10.toFixed(2);
    } catch (error) {
      p10_formatted = onbekend_1;
    }

    try {
      p90_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.p90.toFixed(2);
    } catch (error) {
      p90_formatted = onbekend_1;
    }

    try {
      summer_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.summer_mean.toFixed(2);
    } catch (error) {
      summer_formatted = onbekend_1;
    }

    try {
      winter_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.winter_mean.toFixed(2);
    } catch (error) {
      winter_formatted = onbekend_1;
    }

    try {
      num_values_formatted =
        result.properties.boxplot_data === null
          ? onbekend_2
          : result.properties.boxplot_data.num_values;
    } catch (error) {
      num_values_formatted = onbekend_1;
    }
  }

  if (result.properties.is_krw_score) {
    // console.log('JAA');
    // console.log("----->", result);
    var returnString = `<dl class="dl-horizontal" width="200" style="overflow:hidden;">
      <dt style="width:100px;">ID</dt>
      <dd style="width:300px;margin-left:130px !important;">${result.properties
        .loc_id}</dd>
      <dt style="width:100px;">Omschrijving</dt>
      <dd style="width:300px;margin-left:130px !important;">${result.properties
        .loc_oms}</dd>`;
    if (result.properties.latest_value !== undefined) {
      returnString += `<dt style="width:100px;">Waarde</dt>
                         <dd style="width:300px;margin-left:130px !important;">${result.properties.latest_value}</dd>`;
    }
    returnString += `</dl> ${photo_url_div}`;
    return returnString;
  } else {
    return `<dl class="dl-horizontal" width="200" style="overflow:hidden;">
      <dt style="width:100px;">ID</dt>
      <dd style="width:300px;margin-left:130px !important;">${result.properties
        .loc_id}</dd>
      <dt style="width:100px;">Omschrijving</dt>
      <dd style="width:300px;margin-left:130px !important;">${result.properties
        .loc_oms}</dd>
      <dt style="width:100px;">Laatste waarde</dt>
      <dd style="width:300px;margin-left:130px !important;">${latest_value_formatted}</dd>
      <dt style="width:100px;">Gemeten op</dt>
      <dd style="width:300px;margin-left:130px !important;">${date_formatted}</dd>
      <dt style="width:100px;">Aantal</dt>
      <dd style="width:300px;margin-left:130px !important;">${num_values_formatted}</dd>
      <dt style="width:100px;">Min</dt>
      <dd style="width:300px;margin-left:130px !important;">${min_formatted}</dd>
      <dt style="width:100px;">Max</dt>
      <dd style="width:300px;margin-left:130px !important;">${max_formatted}</dd>
      <dt style="width:100px;">SD</dt>
      <dd style="width:300px;margin-left:130px !important;">${std_formatted}</dd>
      <dt style="width:100px;">Gemiddelde</dt>
      <dd style="width:300px;margin-left:130px !important;">${mean_formatted}</dd>
      <dt style="width:100px;">Mediaan</dt>
      <dd style="width:300px;margin-left:130px !important;">${median_formatted}</dd>
      <dt style="width:100px;">Q1</dt>
      <dd style="width:300px;margin-left:130px !important;">${q1_formatted}</dd>
      <dt style="width:100px;">Q3</dt>
      <dd style="width:300px;margin-left:130px !important;">${q3_formatted}</dd>
      <dt style="width:100px;">P10</dt>
      <dd style="width:300px;margin-left:130px !important;">${p10_formatted}</dd>
      <dt style="width:100px;">P90</dt>
      <dd style="width:300px;margin-left:130px !important;">${p90_formatted}</dd>
      <dt style="width:100px;">ZGM</dt>
      <dd style="width:300px;margin-left:130px !important;">${summer_formatted}</dd>
      <dt style="width:100px;">WGM</dt>
      <dd style="width:300px;margin-left:130px !important;">${winter_formatted}</dd>
      </dl> ${photo_url_div}`;
  }
}
