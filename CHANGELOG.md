История изменений
=================

0.5.0
-----

* Добавлена возможность запускать обычные (не magic) таски ([#46]).
* Снижено потребление памяти при сохранении кэша ([#45]).
* Модуль `chalk@0.5.1` обновлён до версии `1.0.0`.
* Модуль `coa@1.0.0` обновлён до версии `1.0.1`.
* Модуль `connect@3.3.4` обновлён до версии `3.3.5`.
* Модуль `serve-index@1.6.2` обновлён до версии `1.6.4`.
* Модуль `serve-static@1.9.0` обновлён до версии `1.9.2`.
* Модуль `vow@0.4.8` обновлён до версии `0.4.9`.

0.4.5
-----

* Исправлен ошибка, из-за которой в консоль выводилось `[object Object]` после успешной сборки ([#42]).
* Модуль `coa@0.4.1` обновлён до версии `1.0.0`.
* Модуль `serve-index@1.6.1` обновлён до версии `1.6.2`.
* Модуль `serve-static@1.8.1` обновлён до версии `1.9.0`.

0.4.4
-----

* Исправлен возвращаемый код при завершении с ошибкой. Теперь в Continues Integration запуск тестов, содержащих ошибки, будет завершаться падением.
* Модуль `serve-index@1.6.0` обновлён до версии `1.6.1`.

0.4.3
-----

* Добавлено сообщение о неудачно завершённой сборке ([#40]).
* Модуль `vow@0.4.7` обновлён до версии `0.4.8`.
* Модуль `serve-static@1.8.0` обновлён до версии `1.8.1`.

0.4.2
-----

* Убрано лишнее сообщение об окончании сборки ([#36]).
* Добавлено сообщение об ошибке, когда не нашлось технологии для сборки обычного таргета ([#38]).
* Исправлена ошибка, при которой дважды запускалась сборка magic-нод ([#39]).
* Модуль `colors` заменен на `chalk` ([#37]).
* Модуль `serve-index@1.5.1` обновлён до версии `1.6.0`: в листинг добавлена ссылка на корень проекта.
* Модуль `connect@3.3.3` обновлён до версии `3.3.4`.
* Модуль `serve-favicon@2.1.7` обновлён до версии `2.2.0`.
* Модуль `serve-static@1.7.1` обновлён до версии `1.8.0`.

0.4.1
-----

* Исправлена команда `make` для случаев сборки обычных нод и таргетов в `pre` режиме.
* Обновлено сообщение о старте сервера.

0.4.0
-----

* Исправлены ошибки в API ([#27]).
* Добавлен синоним `--force` для опции `--no-cache` ([#22]).
* При возникновении ошибки методы возвращают rejected-промис, вместо вызова `exit` ([#24]).
* При возникновении ошибки `middleware` выводит сообщение в консоль ([#23]).
* Испралено сообщение о старте сервера ([#29]).

0.3.0
-----

* Добавлен бинарный файл `magic` ([#9]).
* Добавлена возможность запуска нескольких тасков ([#13]).
* Переход на `enb-magic-factory` версии `0.4.0` ([#7], [#18]).
* Команда `make` теперь умеет собирать обычные (не magic) ноды и таргеты ([#20]).
* Модуль `connect` обновлён до версии `3.3.3`.
* Модуль `serve-favicon` обновлён до версии `2.1.7`.
* Модуль `serve-index` обновлён до версии `1.5.1`.
* Модуль `vow` обновлён до версии `0.4.7`.

0.2.1
-----

* Модуль `connect` обновлён до версии `3.3.2`.
* Модуль `serve-static` обновлён до версии `1.7.1`.
* Модуль `vow` обновлён до версии `0.4.7`.
* Обновлён `cli`([#5]).
* Исправлена ошибка из-за асинхронного запуска `run` и `make` команд ([#3]).


0.2.0
-----

* Переход на `enb-magic-factory@0.3.x`.
* Модуль `connect` обновлён до версии `3.3.0`.

[#46]: https://github.com/enb-bem/enb-magic-platform/issues/46
[#45]: https://github.com/enb-bem/enb-magic-platform/issues/45
[#42]: https://github.com/enb-bem/enb-magic-platform/issues/42
[#40]: https://github.com/enb-bem/enb-magic-platform/issues/40
[#39]: https://github.com/enb-bem/enb-magic-platform/issues/39
[#38]: https://github.com/enb-bem/enb-magic-platform/issues/38
[#37]: https://github.com/enb-bem/enb-magic-platform/issues/37
[#36]: https://github.com/enb-bem/enb-magic-platform/issues/36
[#27]: https://github.com/enb-bem/enb-magic-platform/issues/27
[#24]: https://github.com/enb-bem/enb-magic-platform/issues/24
[#23]: https://github.com/enb-bem/enb-magic-platform/issues/23
[#22]: https://github.com/enb-bem/enb-magic-platform/issues/22
[#20]: https://github.com/enb-bem/enb-magic-platform/issues/20
[#18]: https://github.com/enb-bem/enb-magic-platform/issues/18
[#13]: https://github.com/enb-bem/enb-magic-platform/issues/13
[#9]: https://github.com/enb-bem/enb-magic-platform/issues/9
[#7]: https://github.com/enb-bem/enb-magic-platform/issues/7
[#5]: https://github.com/enb-bem/enb-magic-platform/issues/5
[#3]: https://github.com/enb-bem/enb-magic-platform/issues/3
