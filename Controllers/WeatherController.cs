using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public WeatherController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string lang = "ka")
        {
            try
            {
                // OpenWeatherMap API
                string apiKey = "9036b62708206c1324cf682be4483bb6";
                string url = $"https://api.openweathermap.org/data/2.5/forecast?q=Gudauri,GE&appid={apiKey}&units=metric";

                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return BadRequest("Weather API error");

                var content = await response.Content.ReadAsStringAsync();
                var jsonDoc = JsonDocument.Parse(content);

                var forecast = new
                {
                    title = GetWeatherTitle(lang),
                    forecast = ExtractForecast(jsonDoc, lang)
                };

                return Ok(forecast);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        private string GetWeatherTitle(string lang)
        {
            return lang switch
            {
                "en" => "Weather in Gudauri",
                "ru" => "Погода в Гудаури",
                _ => "ამინდი გუდაურში"
            };
        }

        private object[] ExtractForecast(JsonDocument jsonDoc, string lang)
        {
            var forecasts = new Dictionary<string, WeatherDay>();
            var root = jsonDoc.RootElement;
            var list = root.GetProperty("list");

            // ყველა პროგნოზ-ი გავარი
            for (int i = 0; i < list.GetArrayLength(); i++)
            {
                var item = list[i];
                var main = item.GetProperty("main");
                var weather = item.GetProperty("weather")[0];
                var dt = item.GetProperty("dt").GetInt64();

                var dateTime = UnixTimeStampToDateTime(dt);
                var dayKey = dateTime.ToString("yyyy-MM-dd");

                var tempMax = (int)main.GetProperty("temp_max").GetDouble();
                var tempMin = (int)main.GetProperty("temp_min").GetDouble();
                var desc = GetWeatherDesc(weather.GetProperty("main").GetString(), lang);

                if (!forecasts.ContainsKey(dayKey))
                {
                    forecasts[dayKey] = new WeatherDay
                    {
                        day = GetDayName(dateTime.DayOfWeek, lang),
                        date = dateTime.ToString("M/d"),
                        tempMax = tempMax,
                        tempMin = tempMin,
                        description = desc,
                        icon = GetWeatherIcon(weather.GetProperty("main").GetString())
                    };
                }
                else
                {
                    // განახლე მაქსიმუმი და მინიმუმი
                    if (tempMax > forecasts[dayKey].tempMax)
                        forecasts[dayKey].tempMax = tempMax;
                    if (tempMin < forecasts[dayKey].tempMin)
                        forecasts[dayKey].tempMin = tempMin;
                }
            }

            return forecasts.Values.Take(5).ToArray();
        }

        private string GetDayName(DayOfWeek day, string lang)
        {
            return lang switch
            {
                "en" => day.ToString(),
                "ru" => day switch
                {
                    DayOfWeek.Monday => "ПН",
                    DayOfWeek.Tuesday => "ВТ",
                    DayOfWeek.Wednesday => "СР",
                    DayOfWeek.Thursday => "ЧТ",
                    DayOfWeek.Friday => "ПТ",
                    DayOfWeek.Saturday => "СБ",
                    DayOfWeek.Sunday => "ВС",
                    _ => "?"
                },
                _ => day switch
                {
                    DayOfWeek.Monday => "ორშ",
                    DayOfWeek.Tuesday => "სამ",
                    DayOfWeek.Wednesday => "ოთხ",
                    DayOfWeek.Thursday => "ხუთ",
                    DayOfWeek.Friday => "პარ",
                    DayOfWeek.Saturday => "შაბ",
                    DayOfWeek.Sunday => "კვი",
                    _ => "?"
                }
            };
        }

        private string GetWeatherDesc(string weather, string lang)
        {
            return (weather, lang) switch
            {
                ("Clear", "en") => "Clear",
                ("Clear", "ru") => "Ясно",
                ("Clear", _) => "მზიანი",
                ("Clouds", "en") => "Cloudy",
                ("Clouds", "ru") => "Облачно",
                ("Clouds", _) => "ღრუბლიანი",
                ("Rain", "en") => "Rainy",
                ("Rain", "ru") => "Дождь",
                ("Rain", _) => "წვიმა",
                ("Snow", "en") => "Snowy",
                ("Snow", "ru") => "Снег",
                ("Snow", _) => "თოვლი",
                _ => weather
            };
        }

        private string GetWeatherIcon(string weather)
        {
            return weather switch
            {
                "Clear" => "☀️",
                "Clouds" => "☁️",
                "Rain" => "🌧️",
                "Snow" => "❄️",
                "Thunderstorm" => "⛈️",
                _ => "🌤️"
            };
        }

        private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            var dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dateTime;
        }
    }

    // ✅ ახალი class
    public class WeatherDay
    {
        public string day { get; set; }
        public string date { get; set; }
        public int tempMax { get; set; }
        public int tempMin { get; set; }
        public string description { get; set; }
        public string icon { get; set; }
    }
}