import React from 'react';
import { Button } from '../ui/button';

function NewSnippetButton() {
  return (
    <Button className="bg-green-500 hover:bg-green-600 text-white rounded-md p-2">
      New Snippet
    </Button>
  );
}

export default NewSnippetButton;
