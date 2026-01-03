// Listener principal para mensajes enviados desde otros scripts de la extensión (por ejemplo, el content script).
chrome.runtime.onMessage.addListener(function (
  _0x5cea02,
  _0x5eb013,
  _0x60b616
) {
  try {
    // Si el mensaje solicita abrir un Reel en una nueva pestaña.
    if (_0x5cea02.openReelTab) {
      var _0x1246c8 =
        _0x5cea02.openReelTab.code || _0x5cea02.openReelTab.shortcode;
      chrome.tabs.create(
        {
          url: "https://www.instagram.com/p/" + _0x1246c8,
        },
        function (_0x144d81) {
          // Cuando la pestaña se ha cargado completamente, se envían comandos para ocultar KernelBrosEngagementBot y realizar acciones como "Like" o "Save".
          chrome.tabs.onUpdated.addListener(function (_0x5b41cb, _0x4a10de) {
            if (_0x4a10de.status === "complete") {
              chrome.tabs.sendMessage(_0x5b41cb, {
                hideKernelBrosEngagementBot: true,
              });
              setTimeout(function () {
                chrome.tabs.sendMessage(_0x5b41cb, {
                  hideKernelBrosEngagementBot: true,
                });
              }, 0xbb8);
              // Si se debe dar "Like" al Reel.
              if (_0x5cea02.openReelTab.LikeWhenWatchingReel == true) {
                setTimeout(function () {
                  chrome.tabs.sendMessage(_0x5b41cb, {
                    clickSomething: 'svg[aria-label="Like"][width="24"]',
                    parent: 'div[role="button"]',
                  });
                }, (_0x5cea02.openReelTab.video_duration || 0x14) * 0x2ee);
              }
              // Si se debe guardar el Reel.
              if (_0x5cea02.openReelTab.SaveWhenWatchingReel == true) {
                setTimeout(function () {
                  chrome.tabs.sendMessage(_0x5b41cb, {
                    clickSomething: 'svg[aria-label="Save"]',
                    parent: 'div[role="button"]',
                  });
                }, (_0x5cea02.openReelTab.video_duration || 0x14) * 0x2ee +
                  0x7d0);
              }
              // Cierra la pestaña después de cierto tiempo.
              setTimeout(function () {
                chrome.tabs.remove(_0x144d81.id);
              }, (_0x5cea02.openReelTab.video_duration || 0x14) * 0x3e8 +
                0x3e8);
            }
          });
        }
      );
    }
    // Si se solicita actualizar el usuario global.
    if (_0x5cea02.updatewanted && _0x5cea02.updatewanted == true) {
      gblIgBotUser.init();
    }
    // Si se recibe un GUID de usuario.
    if (_0x5cea02.guidCookie) {
      gblIgBotUser.overrideGuid(_0x5cea02.guidCookie);
    }
    // Si se termina el free trial.
    if (_0x5cea02.ftOver == "true") {
      gblIgBotUser.overrideFT();
    }
    // Si se recibe información de usuario de Instagram.
    if (_0x5cea02.ig_user) {
      gblIgBotUser.ig_users.push(_0x5cea02.ig_user);
      // Elimina duplicados.
      gblIgBotUser.ig_users = Array.from(
        new Set(gblIgBotUser.ig_users.map(JSON.stringify))
      ).map(JSON.parse);
      gblIgBotUser.current_ig_username = _0x5cea02.ig_user.username;
      // Si se reciben estadísticas de la cuenta.
      if (_0x5cea02.ig_user_account_stats) {
        gblIgBotUser.account_growth_stats.push(_0x5cea02.ig_user_account_stats);
        gblIgBotUser.account_growth_stats = Array.from(
          new Set(gblIgBotUser.account_growth_stats.map(JSON.stringify))
        ).map(JSON.parse);
      }
      checkInstallDate();
      gblIgBotUser.saveToLocal();
      gblIgBotUser.saveToServer();
    }
    // Si se solicita abrir la pantalla de compra.
    if (_0x5cea02.fnc == "openBuyScreen") {
      openBuyScreen();
    }
    // Responde al mensaje.
    _0x60b616();
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

// Objeto global que almacena información del usuario y métodos relacionados.
var gblIgBotUser = {
  user_guid: undefined, // Identificador único del usuario.
  install_date: new Date().toUTCString(), // Fecha de instalación.
  instabot_install_date: undefined, // Fecha de instalación de Instabot.
  ig_users: [], // Lista de usuarios de Instagram gestionados.
  licenses: {}, // Información de licencias.
  actions: [
    {
      date: "",
      action: "",
    },
  ], // Acciones realizadas.
  account_growth_stats: [], // Estadísticas de crecimiento de cuentas.
  options: {}, // Opciones de configuración.
  // Inicializa el usuario global, obtiene o genera el GUID.
  init: async function () {
    runWinVarsScript();
    this.user_guid = await this.getPref("kernelbros_user_guid");
    if (!this.user_guid || this.user_guid == false) {
      this.user_guid = this.uuidGenerator();
      this.setPref("kernelbros_user_guid", this.user_guid);
    }
  },
  // Sobrescribe el GUID del usuario.
  overrideGuid: function (_0x7a902f) {
    this.user_guid = _0x7a902f;
    this.setPref("kernelbros_user_guid", this.user_guid);
  },
  // Finaliza el free trial y abre la pantalla de compra.
  overrideFT: function () {
    this.instabot_free_trial_time = 0x0;
    openBuyScreen();
  },
  // Generador de GUID aleatorio.
  uuidGenerator: function () {
    return (
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      "-" +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      "-" +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      "-" +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      "-" +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1) +
      (((0x1 + Math.random()) * 0x10000) | 0x0).toString(0x10).substring(0x1)
    );
  },
  // Obtiene una preferencia almacenada en chrome.storage.local.
  getPref: async function (_0x463a31) {
    return new Promise(function (_0xf77df2) {
      chrome.storage.local.get(_0x463a31, function (_0x3bcf02) {
        if (Object.keys(_0x3bcf02).length > 0x0) {
          _0xf77df2(_0x3bcf02[_0x463a31]);
        } else {
          _0xf77df2(false);
        }
      });
    });
  },
  // Establece una preferencia en chrome.storage.local.
  setPref: async function (_0x40f689, _0x35bae7) {
    chrome.storage.local.set(
      {
        [_0x40f689]: _0x35bae7,
      },
      function () {}
    );
  },
  // Guarda el objeto de usuario en el almacenamiento local.
  saveToLocal: function () {
    chrome.storage.local.set(
      {
        igBotUser: JSON.stringify(gblIgBotUser),
      },
      function () {}
    );
  },
  // Envía la información del usuario al servidor remoto.
  saveToServer: function () {
    for (var _0x1519e1 = 0x0; _0x1519e1 < this.ig_users.length; _0x1519e1++) {
      fetch("https://www.kernelbros.com.ar/igBotUser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_guid: this.user_guid,
          ig_username: this.current_ig_username,
          install_date: this.install_date,
          instabot_install_date: this.instabot_install_date,
        }),
      });
    }
  },
};

// Variables globales para el control de instalación y tiempo.
var first_run = false;
var todaysdate = new Date();
var today = todaysdate.getTime();
var timeSinceInstall;

// Listener para el icono de la extensión: abre o activa Instagram y muestra KernelBrosEngagementBot.
chrome.action.onClicked.addListener(function (_0x3554e0) {
  chrome.tabs.query(
    {
      url: ["https://www.instagram.com/", "https://www.instagram.com/*"],
      currentWindow: true,
    },
    (_0x275f35) => {
      if (_0x275f35.length === 0x0) {
        // Si no hay pestañas de Instagram, abre una nueva.
        chrome.tabs.create(
          {
            url: "https://www.instagram.com/",
          },
          function (_0x4d20fd) {
            chrome.tabs.sendMessage(_0x4d20fd.id, {
              openKernelBrosEngagementBot: true,
              igBotUser: gblIgBotUser,
            });
          }
        );
      } else {
        // Si hay pestañas, activa la actual o la primera y muestra KernelBrosEngagementBot.
        var _0x2072a7 = false;
        for (var _0x26b409 = 0x0; _0x26b409 < _0x275f35.length; _0x26b409++) {
          if (_0x275f35[_0x26b409].active === true) {
            _0x2072a7 = true;
            chrome.tabs.sendMessage(_0x275f35[_0x26b409].id, {
              toggleKernelBrosEngagementBot: true,
              igBotUser: gblIgBotUser,
            });
          }
        }
        if (_0x2072a7 === false) {
          chrome.tabs.update(_0x275f35[0x0].id, {
            active: true,
          });
          chrome.tabs.sendMessage(_0x275f35[0x0].id, {
            openKernelBrosEngagementBot: true,
            igBotUser: gblIgBotUser,
          });
        }
      }
    }
  );
});

// Listener para la instalación o actualización de la extensión.
chrome.runtime.onInstalled.addListener(installedOrUpdated);

// Función que se ejecuta al instalar o actualizar la extensión.
function installedOrUpdated() {
  gblIgBotUser.init();
  chrome.tabs.create(
    {
      url: "https://www.instagram.com",
    },
    function (_0x225b69) {
      setTimeout(function () {
        sendMessageToInstagramTabs({
          extension_updated: true,
        });
      }, 0x1388);
    }
  );
}

// Ejecuta el script winvars.js en todas las pestañas de Instagram.
function runWinVarsScript() {
  chrome.tabs.query(
    {
      url: ["https://www.instagram.com/*", "https://www.instagram.com/"],
    },
    (_0x342f6b) => {
      for (var _0x3aadec = 0x0; _0x3aadec < _0x342f6b.length; _0x3aadec++) {
        var _0x582521 = _0x342f6b[_0x3aadec].id;
        chrome.scripting.executeScript(
          {
            target: {
              tabId: _0x582521,
            },
            files: ["winvars.js"],
            world: "MAIN",
          },
          function () {}
        );
      }
    }
  );
}

// Verifica la fecha de instalación y licencia, y la almacena si es la primera vez.
async function checkInstallDate() {
  var _0x19a769 = await gblIgBotUser.getPref("instabot_install_date");
  if (_0x19a769 == false) {
    first_run = true;
    _0x19a769 = "" + today;
    gblIgBotUser.setPref("instabot_install_date", _0x19a769);
  }
  gblIgBotUser.instabot_install_date = _0x19a769;
  gblIgBotUser.install_date = new Date(+_0x19a769).toUTCString();
  timeSinceInstall = today - _0x19a769;
  checkLicenseOnServer();
}

// Envía un mensaje a todas las pestañas de Instagram y KernelBrosEngagementBot.
function sendMessageToInstagramTabs(_0x3f9799) {
  chrome.tabs.query(
    {
      url: [
        "https://www.instagram.com/",
        "https://www.instagram.com/*",
        "https://www.kernelbros.com.ar/*",
      ],
    },
    function (_0x48ef9d) {
      for (var _0x52a6a7 = 0x0; _0x52a6a7 < _0x48ef9d.length; _0x52a6a7++) {
        chrome.tabs
          .sendMessage(_0x48ef9d[_0x52a6a7].id, _0x3f9799)
          .then((_0x235f80) => {})
          ["catch"](function () {});
      }
    }
  );
}

// Función vacía para manejar errores (puede ser extendida).
function onError(_0x59a1ac) {}

// Verifica la licencia del usuario en el servidor.
function checkLicenseOnServer() {
  var _0x45be56 =
    "https://www.kernelbros.com.ar/check_subscription.php?guid=" +
    gblIgBotUser.user_guid +
    "&ign=" +
    btoa(gblIgBotUser.current_ig_username);
  console.log(_0x45be56);
  fetch(_0x45be56, {
    method: "GET",
  })
    .then((_0x41da5e) => _0x41da5e.text())
    .then(function (_0x35fd5f) {
      console.log(_0x35fd5f);
      if (parseInt(_0x35fd5f) == 0x1) {
        allLicensesFetched(0x1, {
          kernelbros_license: 0x1,
        });
      } else if (parseInt(_0x35fd5f) == 0x2) {
        allLicensesFetched(0x2, {});
      } else {
        allLicensesFetched(0x0, {});
      }
    })
    .catch(function (error) {
      console.error("Failed to fetch license from server:", error);
      allLicensesFetched(0x0, {});
    });
}

// Procesa la información de licencias y la comunica a las pestañas.
function allLicensesFetched(_0xae4b61, _0x8816a8) {
  sendMessageToInstagramTabs({
    instabot_install_date: gblIgBotUser.instabot_install_date,
    instabot_free_trial_time: 0x9a7ec800, // Tiempo de prueba gratis (en ms).
    instabot_has_license: true, // Siempre se marca como true.
    igBotUser: gblIgBotUser,
  });
  gblIgBotUser.licenses = _0x8816a8;
  gblIgBotUser.saveToLocal();
}

// Abre la pantalla de compra en las pestañas de Instagram.
function openBuyScreen() {
  sendMessageToInstagramTabs({
    openBuyScreen: true,
    igBotUser: gblIgBotUser,
    instabot_free_trial_time: 0x9a7ec800,
  });
}

// Elimina duplicados de un array de objetos.
function uniq(_0x379c68) {
  return Array.from(new Set(_0x379c68.map(JSON.stringify))).map(JSON.parse);
}
