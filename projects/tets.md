---
title: ja Proasldkject
date: 2024-10-20
tags: [test, demo]
github: https://github.com/test/test
demo: https://test.com
---
# AI Music Generator

## Overview
**AI Music Generator** is a creative command-line and web-based tool that uses 
machine learning to compose short pieces of instrumental music in various 
styles — from classical piano to lo-fi beats.

The idea came from wanting to explore how neural networks could emulate 
musical creativity. Instead of pre-recorded samples, this project uses 
note-level generation to produce melodies that sound natural yet unique.

## Features
- **Multi-Genre Support**: Generate music in different styles — ambient, 
  classical, or electronic  
- **MIDI Export**: Save generated songs as `.midi` files for use in any 
  digital audio workstation  
- **Real-Time Playback**: Listen instantly using a built-in Python player  
- **Seed Control**: Reproduce melodies using the same random seed  
- **TUI Interface**: Fully interactive, colorful terminal interface using 
  the `rich` library  

## Technical Stack
- **Language**: Python 3.11  
- **Libraries**: `torch`, `numpy`, `mido`, `rich`, `argparse`  
- **Model**: LSTM-based neural network trained on 10,000+ MIDI files  
- **Deployment**: Docker + Streamlit for optional web mode  
- **Tools**: GitHub Actions, Poetry, FFMPEG  

## Code Example
```python
# ai_music_generator/core.py
import torch
import numpy as np
from rich.console import Console

console = Console()

def generate_melody(seed: int = 42, length: int = 50):
    """Generate a short melody using a trained LSTM model."""
    torch.manual_seed(seed)
    notes = np.random.choice(range(60, 72), length)  # MIDI pitches
    console.print(f"[green]Generated melody:[/green] {notes.tolist()}")
    return notes