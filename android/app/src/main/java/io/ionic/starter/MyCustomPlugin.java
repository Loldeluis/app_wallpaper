package io.ionic.starter; // usa aquí tu package real (ej: io.ionic.starter)

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.IOException;

@CapacitorPlugin(name = "MyCustomPlugin")
public class MyCustomPlugin extends Plugin {

  private static final String TAG = "MyCustomPlugin";

  @PluginMethod
  public void setWallpaper(PluginCall call) {
    final String url = call.getString("url");
    final String type = call.getString("type", "home"); // "home" por defecto

    if (url == null || url.isEmpty()) {
      call.reject("No se proporcionó URL");
      return;
    }

    // Ejecutar en hilo aparte para no bloquear UI
    new Thread(() -> {
      HttpURLConnection connection = null;
      try {
        Bitmap bitmap = downloadImage(url);
        if (bitmap == null) {
          call.reject("No se pudo descargar la imagen");
          return;
        }

        WallpaperManager wallpaperManager = WallpaperManager.getInstance(getContext());

        if ("lock".equalsIgnoreCase(type)) {
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);
          } else {
            // En dispositivos antiguos no hay bandera para lock screen; intentar setBitmap normal
            wallpaperManager.setBitmap(bitmap);
          }
        } else {
          // tipo "home" o por defecto
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM);
          } else {
            wallpaperManager.setBitmap(bitmap);
          }
        }

        JSObject res = new JSObject();
        res.put("success", true);
        res.put("message", "Wallpaper aplicado");
        call.resolve(res);
      } catch (Exception e) {
        Log.e(TAG, "Error al aplicar wallpaper", e);
        call.reject("Error al aplicar wallpaper: " + e.getMessage());
      } finally {
        if (connection != null) {
          connection.disconnect();
        }
      }
    }).start();
  }

  private Bitmap downloadImage(String imageUrl) {
    HttpURLConnection connection = null;
    try {
      URL url = new URL(imageUrl);
      connection = (HttpURLConnection) url.openConnection();
      connection.setDoInput(true);
      connection.connect();
      InputStream input = connection.getInputStream();
      return BitmapFactory.decodeStream(input);
    } catch (IOException e) {
      Log.e(TAG, "downloadImage error", e);
      return null;
    } finally {
      if (connection != null) {
        connection.disconnect();
      }
    }
  }
}
