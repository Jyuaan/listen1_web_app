document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.settings-content:last-child').innerHTML =
    "<p class='ng-binding'>这是一个可以使用 Listen 1 特性的 Web App 版本。</p>" +
    "<p class='ng-binding'>Listen 1 Web App 反馈: <a open-url=\"'coolmarket://u/1585533'\"> しろくろ (酷安) </a></p>" +
    "<p class='ng-binding'>Listen 1 Web App 主页: <a open-url=\"'https://github.com/Jyuaan/listen1_web_app'\" class='ng-isolate-scope'> https://github.com/Jyuaan/listen1_web_app </a></p>" +
    "<p class='ng-binding'>Listen 1 主页: <a open-url=\"'http://listen1.github.io/listen1/'\" class='ng-isolate-scope'> http://listen1.github.io/listen1/ </a></p>" +
    "<p class='ng-binding'>主题设计: iparanoid</p>" +
    "<p class='ng-binding'>当前版本: " + plus.runtime.version + " (本软件基于MIT协议开源免费)</p>"
  const backupbtn = document.querySelector('button[ng-click="backupMySettings()"]')
  backupbtn.removeAttribute('ng-click')
  backupbtn.addEventListener('click', plus_backupMySettings)
  cookieGet = plus_cookieGet
  const xiami_search = xiami.search
  xiami.search = (url, hm, se) => {
    return xiami_search(url, plus_http, se)
  }
  const qq_show_playlist = qq.show_playlist
  qq.show_playlist = (url, hm) => {
    return qq_show_playlist(url, plus_http)
  }
  const qq_search = qq.search
  qq.search = (url, hm, se) => {
    return qq_search(url, plus_http, se)
  }
  const qq_get_playlist = qq.get_playlist
  qq.get_playlist = (url, hm, se) => {
    if (getParameterByName('list_id', url).split('_')[0] == 'qqplaylist') {
      return qq_get_playlist(url, plus_http, se)
    } else {
      return qq_get_playlist(url, hm, se)
    }
  }
  const qq_lyric = qq.lyric
  qq.lyric = (url, hm, se) => {
    return qq_lyric(url, plus_http, se)
  }
  const kugou_get_playlist = kugou.get_playlist
  kugou.get_playlist = (url, hm, se) => {
    const list_id = getParameterByName('list_id', url).split('_')[0];
    switch (list_id) {
      case 'kgplaylist':
        return plus_kugou().get_playlist(url, hm, se);
      case 'kgalbum':
        return plus_kugou().album(url, hm, se);
      default:
        return kugou_get_playlist(url, hm, se);
    }
  }
  const kugou_bootstrap_track = kugou.bootstrap_track
  kugou.bootstrap_track = (sound, track, success, failure, hm, se) => {
    return kugou_bootstrap_track(sound, track, success, failure, plus_http, se)
  }
  const kuwo_search = kuwo.search
  kuwo.search = (url, hm, se) => {
    return kuwo_search(url, plus_http, se)
  }
  const migu_bootstrap_track = migu.bootstrap_track
  migu.bootstrap_track = (sound, track, success, failure, hm, se) => {
    return migu_bootstrap_track(sound, track, success, failure, plus_http, se)
  }
  const migu_lyric = migu.lyric
  migu.lyric = (url, hm, se) => {
    return migu_lyric(url, plus_http, se)
  }
});
const themeColor = {
  'iparanoid': "#FFFFFF",
  'origin': "#333333"
}
const themeStyle = {
  'iparanoid': "dark",
  'origin': "light"
}
const observer = new MutationObserver((mutationsList, observer) => {
  const theme = mutationsList[0].target.href.split('css')[1].slice(1, -1)
  plus.navigator.setStatusBarBackground(themeColor[theme]);
  plus.navigator.setStatusBarStyle(themeStyle[theme]);
});
observer.observe(document.getElementById('theme'), {
  attributeFilter: ['href']
});
plus.key.addEventListener("backbutton", () => {
  const $scope = angular.element(document.querySelector('div[ng-controller="NavigationController"]')).scope();
  if ($scope.window_url_stack.length === 0) {
    if ($scope.current_tag == 3 || $scope.current_tag == 4) {
      plus.storage.setItem('close', 'false');
      $scope.showTag(2);
    } else if (plus.storage.getItem('close') != 'true') {
      plus.storage.setItem('close', 'true');
      plus.nativeUI.toast('再次返回将退出');
      setTimeout(() => {
        plus.storage.setItem('close', 'false');
      }, 2000);
    } else {
      plus.storage.setItem('close', 'false');
      plus.runtime.quit();
    }
  } else {
    plus.storage.setItem('close', 'false');
    $scope.popWindow();
  }
});
plus.webview.getLaunchWebview().overrideUrlLoading({
  match: '.*'
}, (e) => {
  plus.runtime.openURL(e.url);
})
const chrome = true;

function plus_cookieGet(cookie, callback) {
  let getcookie = plus.navigator.getCookie(cookie.url);
  if (getcookie) {
    const arg1 = {
      name: cookie.name,
      value: getcookie.split(cookie.name + '=')[1] && getcookie.split(cookie.name + '=')[1].split(';')[0]
    }
    callback(arg1, null);
  } else {
    let w = plus.webview.create(cookie.url);
    w.addEventListener('loaded', () => {
      w.close();
      w = null;
      getcookie = plus.navigator.getCookie(cookie.url);
      const arg1 = {
        name: cookie.name,
        value: getcookie.split(cookie.name + '=')[1] && getcookie.split(cookie.name + '=')[1].split(';')[0]
      }
      callback(arg1, null);
    })
  }
}
document.write("<script type='text/javascript' src='js/background.js'></script>");
const referurl = {
  'api.xiami.com': 'json',
  'c.y.qq.com': 'text',
  'i.y.qq.com': 'text',
  'm.kugou.com': 'text',
  'www.kuwo.cn': 'json',
  'music.migu.cn': 'json'
}
const plus_http = (set) => {
  return new Promise((resolve, reject) => {
    let xhr = new plus.net.XMLHttpRequest();
    xhr.onload = () => {
      if (referurl[set.url.split('/')[2]] == 'json') {
        var response = {
          data: xhr.response
        }
      } else {
        var response = {
          data: xhr.responseText
        }
      }
      xhr.abort()
      xhr = null;
      resolve(response)
    }
    xhr.open(set.method, set.url + new URLSearchParams(set.params).toString());
    xhr.responseType = 'json';
    for (let key in set.headers) {
      xhr.setRequestHeader(key, set.headers[key])
    }
    for (let key of hack_referer_header({
        url: set.url,
        requestHeaders: []
      }).requestHeaders) {
      xhr.setRequestHeader(key.name, key.value)
    }
    xhr.send();
  })
}
plus_http.get = (target_url) => {
  return plus_http({
    method: "GET",
    url: target_url
  })
}

const plus_kugou = () => {
  function async_process_list(data_list, handler, handler_extra_param_list, callback) {
    const fnDict = {};
    data_list.forEach((item, index) => {
      fnDict[index] = cb => handler(index, item, handler_extra_param_list, cb);
    });
    async.parallel(fnDict,
      (err, results) => callback(null, data_list.map((item, index) => results[index])));
  }

  function kg_render_playlist_result_item(index, item, params, callback) {
    const hm = params[0];
    let target_url = `${'http://m.kugou.com/app/i/getSongInfo.php?'
            + 'cmd=playInfo&hash='}${item.hash}`;

    const track = {
      id: `kgtrack_${item.hash}`,
      title: '',
      artist: '',
      artist_id: '',
      album: '',
      album_id: `kgalbum_${item.album_id}`,
      source: 'kugou',
      source_url: `http://www.kugou.com/song/#hash=${
            item.hash}&album_id=${item.album_id}`,
      img_url: '',
      url: `xmtrack_${item.hash}`,
      lyric_url: item.hash,
    };
    // Fix song info
    plus_http.get(target_url).then((response) => {
      const data = JSON.parse(response.data);
      track.title = data.songName;
      track.artist = data.singerId === 0 ?
        '未知' : data.singerName;
      track.artist_id = `kgartist_${data.singerId}`;
      if (data.imgUrl !== undefined) {
        track.img_url = data.imgUrl.replace('{size}', '400');
      } else {
        // track['img_url'] = data.imgUrl.replace('{size}', '400');
      }
      // Fix album
      target_url = `http://mobilecdnbj.kugou.com/api/v3/album/info?albumid=${
            item.album_id}`;
      hm.get(target_url).then((res) => {
        const {
          data: res_data
        } = res;
        if (res_data.status && res_data.data !== undefined && res_data.data !== null) {
          track.album = res_data.data.albumname;
        } else {
          track.album = '';
        }
        return callback(null, track);
      });
    });
  }

  function kg_get_playlist(url, hm, se) { // eslint-disable-line no-unused-vars
    return {
      success(fn) {
        const list_id = getParameterByName('list_id', url).split('_').pop();
        const target_url = `http://m.kugou.com/plist/list/${list_id}?json=true`;

        hm.get(target_url).then((response) => {
          const {
            data
          } = response;

          const info = {
            cover_img_url: data.info.list.imgurl ?
              data.info.list.imgurl.replace('{size}', '400') : '',
            title: data.info.list.specialname,
            id: `kgplaylist_${data.info.list.specialid}`,
            source_url: 'http://www.kugou.com/yy/special/single/{size}.html'
              .replace('{size}', data.info.list.specialid),
          };

          async_process_list(data.list.list.info, kg_render_playlist_result_item, [hm],
            (err, tracks) => fn({
              tracks,
              info,
            }));
        });
      },
    };
  }

  function kg_render_album_result_item(index, item, params, callback) {
    const hm = params[0];
    const info = params[1];
    const album_id = params[2];
    const track = {
      id: `kgtrack_${item.hash}`,
      title: '',
      artist: '',
      artist_id: '',
      album: info.title,
      album_id: `kgalbum_${album_id}`,
      source: 'kugou',
      source_url: `http://www.kugou.com/song/#hash=${
            item.hash}&album_id=${album_id}`,
      img_url: '',
      url: `xmtrack_${item.hash}`,
      lyric_url: item.hash,
    };
    // Fix other data
    const target_url =
      `${'http://m.kugou.com/app/i/getSongInfo.php?'
                + 'cmd=playInfo&hash='}${item.hash}`;
    hm({
      url: target_url,
      method: 'GET',
      transformResponse: undefined,
    }).then((response) => {
      const data = JSON.parse(response.data);
      track.title = data.songName;
      track.artist = data.singerId === 0 ?
        '未知' : data.singerName;
      track.artist_id = `kgartist_${data.singerId}`;
      track.img_url = data.imgUrl.replace('{size}', '400');
      callback(null, track);
    });
  }

  function kg_album(url, hm, se) { // eslint-disable-line no-unused-vars
    return {
      success(fn) {
        const album_id = getParameterByName('list_id', url).split('_').pop();
        let target_url = `${'http://mobilecdnbj.kugou.com/api/v3/album/info?'
              + 'albumid='}${album_id}`;

        let info;
        // info
        hm({
          url: target_url,
          method: 'GET',
          transformResponse: undefined,
        }).then((response) => {
          let {
            data
          } = response;
          data = JSON.parse(data);

          info = {
            cover_img_url: data.data.imgurl.replace('{size}', '400'),
            title: data.data.albumname,
            id: `kgalbum_${data.data.albumid}`,
            source_url: 'http://www.kugou.com/album/{id}.html'
              .replace('{id}', data.data.albumid),
          };

          target_url =
            `${'http://mobilecdnbj.kugou.com/api/v3/album/song?'
                + 'albumid='}${album_id}&page=1&pagesize=-1`;
          hm({
            url: target_url,
            method: 'GET',
            transformResponse: undefined,
          }).then((res) => {
            let res_data = res.data;
            res_data = JSON.parse(res_data);

            async_process_list(res_data.data.info, kg_render_album_result_item,
              [plus_http, info, album_id],
              (err, tracks) => fn({
                tracks,
                info,
              }));
          });
        });
      },
    };
  }
  return {
    album: kg_album,
    get_playlist: kg_get_playlist
  };
}

function plus_backupMySettings() {
  const items = {};
  Object.keys(localStorage).forEach((key) => {
    items[key] = localStorage.getObject(key);
  });
  const content = JSON.stringify(items);
  plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
    fs.root.getFile('listen1_backup_' + new Date().getTime() + '.json', {
      create: true
    }, (fileEntry) => {
      fileEntry.createWriter((writer) => {
        writer.write(content);
        writer.onwrite = () => {
          plus.nativeUI.toast('歌单保存至: ' + fileEntry.toLocalURL());
        }
      })
    })
  });
}
