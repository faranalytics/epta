import { $, ActivatorT } from 'elemental-0';

export let errorTemplate: ActivatorT = $('!DOCTYPE html')(
    $('html', { 'lang': 'en' })(
        $('head')(),
        $('body', {'id':'error'})(),
        $('footer')()
    )
)