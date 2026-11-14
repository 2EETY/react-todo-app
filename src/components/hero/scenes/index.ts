import type { ComponentType } from 'react'
import { ForestWalk } from './ForestWalk'
import { QuietSea } from './QuietSea'
import { RainyTrail } from './RainyTrail'
import { ReedField } from './ReedField'

export interface Scene {
  id: string
  name: string
  /**
   * 직접 만든 AI 배경이나 사진을 쓰고 싶다면 public/backgrounds/에 넣고
   * image: '/backgrounds/reed.jpg' 처럼 경로를 적으면 일러스트 대신 이미지가 나온다.
   */
  image?: string
  Illustration: ComponentType
}

export const SCENES: Scene[] = [
  { id: 'reed', name: '바람 부는 갈대밭', Illustration: ReedField },
  { id: 'rain', name: '비 오는 산길', Illustration: RainyTrail },
  { id: 'sea', name: '잔잔한 바다', Illustration: QuietSea },
  { id: 'forest', name: '숲 산책길', Illustration: ForestWalk },
]
