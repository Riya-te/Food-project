import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/userSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData, lat, lng } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    // ⛔ wait until user is authenticated
    if (!userData) return;

    // ⛔ geolocation not supported
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const successHandler = async ({ coords }) => {
      const currentLat = coords.latitude;
      const currentLng = coords.longitude;

      // ⛔ skip if location didn't change
      if (lat === currentLat && lng === currentLng) return;

      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/reverse",
          {
            params: {
              lat: currentLat,
              lon: currentLng,
              format: "json",
              apiKey,
            },
          }
        );

        const place = res.data?.results?.[0];
        if (!place) return;

        const city =
          place.city ||
          place.district ||
          place.county ||
          place.state ||
          place.country;

        const state =
          place.state ||
          place.region ||
          place.county ||
          null;

        if (!city) return;

        dispatch(
          setLocation({
            city,
            state,
            lat: currentLat,
            lng: currentLng,
          })
        );
      } catch (error) {
        console.error("Geo API error:", error);
      }
    };

    const errorHandler = (error) => {
      console.error("Geolocation error:", error.message);
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [dispatch, userData, lat, lng, apiKey]);
};

export default useGetCity;
