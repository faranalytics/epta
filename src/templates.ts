import { $, ElementalT } from 'elemental-0';

export let errorTemplate: ElementalT = $('!DOCTYPE html')(
    $('html', { 'lang': 'en' })(
        $('head')(),
        $('body', {'id':'error'})(),
        $('footer')()
    )
)