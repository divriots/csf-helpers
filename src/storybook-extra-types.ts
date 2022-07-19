// missing typings from storybook are added here

import type {
  Args,
  AnyFramework,
  BaseAnnotations,
  StoryFn,
  LegacyStoryFn,
  ProjectAnnotations,
  StrictArgTypes,
  StrictGlobalTypes,
  StoryAnnotations,
  StoryContextForLoaders,
  StoryContext,
  StoryContextForEnhancers,
  StoryId,
  ComponentId,
  ComponentAnnotations,
} from '@storybook/csf';

export type BaseStoryMetadata = BaseAnnotations & {
  globals?: Args;
  framework?: string;
};

export type StoryObj =
  | (StoryFn &
      BaseStoryMetadata & {
        story?: BaseStoryMetadata;
        name?: string;
      })
  | (BaseStoryMetadata & {
      story?: BaseStoryMetadata;
      name?: string;
    });

export type StoryDefault<
  TFramework extends AnyFramework = AnyFramework,
  TArgs = Args
> = ComponentAnnotations<TFramework, TArgs> & {
  globals?: TArgs;
  framework?: string;
};

export type NormalizedProjectAnnotations<
  TFramework extends AnyFramework = AnyFramework
> = ProjectAnnotations<TFramework> & {
  argTypes?: StrictArgTypes;
  globalTypes?: StrictGlobalTypes;
};

export type NormalizedComponentAnnotations<
  TFramework extends AnyFramework = AnyFramework
> = ComponentAnnotations<TFramework> & {
  // Useful to guarantee that id exists
  id: ComponentId;
  argTypes?: StrictArgTypes;
};

export type NormalizedStoryAnnotations<
  TFramework extends AnyFramework = AnyFramework
> = Omit<StoryAnnotations<TFramework>, 'storyName' | 'story'> & {
  // You cannot actually set id on story annotations, but we normalize it to be there for convience
  id: StoryId;
  argTypes?: StrictArgTypes;
  userStoryFn?: StoryFn<TFramework>;
};

export type Story<TFramework extends AnyFramework = AnyFramework> =
  StoryContextForEnhancers<TFramework> & {
    originalStoryFn: StoryFn<TFramework>;
    undecoratedStoryFn: LegacyStoryFn<TFramework>;
    unboundStoryFn: LegacyStoryFn<TFramework>;
    applyLoaders: (
      context: StoryContextForLoaders<TFramework>
    ) => Promise<StoryContext<TFramework>>;
    playFunction: (context: StoryContext<TFramework>) => Promise<void> | void;
  };